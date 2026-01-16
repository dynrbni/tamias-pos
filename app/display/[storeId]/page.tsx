"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, CreditCard, CheckCircle, Store, Banknote } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Initialize Supabase Client (Public)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CartItem = {
    product_id: string;
    name: string;
    price: number;
    qty: number;
    image_url?: string;
};

type DisplayState = "idle" | "active" | "payment" | "success";

export default function CustomerDisplay() {
    const params = useParams();
    const storeId = params.storeId as string;

    const [state, setState] = useState<DisplayState>("idle");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>("cash");
    const [qrisUrl, setQrisUrl] = useState<string | null>(null);
    const [storeName, setStoreName] = useState("Tamias POS");
    const [changeAmount, setChangeAmount] = useState(0);

    // Derived totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;

    const [realStoreId, setRealStoreId] = useState<string | null>(null);
    const [employees, setEmployees] = useState<{ id: string, name: string, employee_id: string, avatar_url?: string }[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

    useEffect(() => {
        if (!storeId) return;

        // Check if storeId is a Short ID (8 digits) or UUID
        const isShortId = /^\d{8}$/.test(storeId);

        const resolveStoreId = async () => {
            let targetId = storeId;
            if (isShortId) {
                // Resolve Short ID -> UUID
                const { data } = await supabase
                    .from("stores")
                    .select("id, name")
                    .eq("display_id", storeId)
                    .single();

                if (data) {
                    targetId = data.id;
                    setRealStoreId(data.id);
                    setStoreName(data.name);
                } else {
                    // ID not found
                    setStoreName("Store Not Found");
                    return;
                }
            } else {
                // It's already a UUID
                setRealStoreId(storeId);

                // Fetch name
                const { data } = await supabase
                    .from("stores")
                    .select("name")
                    .eq("id", storeId)
                    .single();
                if (data) setStoreName(data.name);
            }

            // Fetch Employees for this store
            const { data: empData } = await supabase
                .from("employees")
                .select("id, name, employee_id, avatar_url")
                .eq("store_id", targetId)
                .order("name");

            if (empData) setEmployees(empData);
        };

        resolveStoreId();
    }, [storeId]);


    // Subscribe to Realtime Channel (using real UUID + Employee ID)
    useEffect(() => {
        if (!realStoreId || !selectedEmployee) return;

        console.log("Subscribing to channel for:", realStoreId, "Employee:", selectedEmployee);

        const channel = supabase.channel(`store-${realStoreId}-employee-${selectedEmployee}`)
            .on("broadcast", { event: "cart-update" }, (payload) => {
                const newCart = payload.payload.cart || [];
                setCart(newCart);
                setState(newCart.length > 0 ? "active" : "idle");
            })
            .on("broadcast", { event: "payment-start" }, (payload) => {
                setPaymentMethod(payload.payload.method);
                setQrisUrl(payload.payload.qrisUrl || null);
                setState("payment");
            })
            .on("broadcast", { event: "payment-success" }, (payload) => {
                setChangeAmount(payload.payload.change || 0);
                setState("success");

                // Reset after 5 seconds
                setTimeout(() => {
                    setCart([]);
                    setState("idle");
                }, 5000);
            })
            .subscribe(async (status) => {
                console.log("Display connected to Employee:", status);
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        type: 'display',
                        online_at: new Date().toISOString()
                    });
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [realStoreId, selectedEmployee]);

    // UI: Employee Selection
    if (realStoreId && !selectedEmployee) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-8 font-outfit">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                    <Store size={32} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2 tracking-tight">
                    {storeName}
                </h1>
                <p className="text-slate-500 font-medium mb-12">
                    Pilih Kasir yang Bertugas
                </p>

                <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
                    {employees.map((emp) => (
                        <button
                            key={emp.id}
                            onClick={() => setSelectedEmployee(emp.id)}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-green-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 group w-[200px]"
                        >
                            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-4 border-slate-50 group-hover:border-green-50 transition-colors">
                                {emp.avatar_url ? (
                                    <Image
                                        src={emp.avatar_url}
                                        alt={emp.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-2xl font-bold text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                        {emp.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="text-center w-full">
                                <p className="font-bold text-lg text-slate-800 group-hover:text-green-700 truncate w-full">{emp.name}</p>
                                <p className="text-xs text-slate-400 font-mono mt-1 bg-slate-100 py-1 px-2 rounded-full inline-block">ID: {emp.employee_id}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // RENDER STATES
    if (state === "idle") {
        const activeEmployee = employees.find(e => e.id === selectedEmployee);

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-8 font-outfit">
                <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 animate-fade-in-up">
                    <Store size={48} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-2 tracking-tight">
                    {storeName}
                </h1>
                <p className="text-lg text-slate-500 font-medium mb-12">
                    Selamat Datang di {storeName}, Selamat Berbelanja
                </p>

                {activeEmployee && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 w-full max-w-sm mb-8 animate-fade-in-up delay-100">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-100 flex-shrink-0">
                            {activeEmployee.avatar_url ? (
                                <Image
                                    src={activeEmployee.avatar_url}
                                    alt={activeEmployee.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-green-50 text-xl font-bold text-green-600">
                                    {activeEmployee.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Kasir yang Bertugas</p>
                            <p className="font-bold text-lg text-slate-800 truncate">{activeEmployee.name}</p>
                            <p className="text-xs text-slate-400 font-mono bg-slate-100 py-0.5 px-2 rounded-full inline-block mt-1">
                                {activeEmployee.employee_id}
                            </p>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setSelectedEmployee(null)}
                    className="text-slate-400 text-sm hover:text-red-500 transition-colors"
                >
                    Ganti Kasir
                </button>
            </div>
        );
    }

    if (state === "success") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-8 text-center font-outfit">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                    <CheckCircle size={48} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Pembayaran Berhasil</h1>
                <p className="text-lg text-slate-500 font-medium mb-10">Silahkan ambil struk pembayaranmu</p>

                {changeAmount > 0 && (
                    <div className="bg-white border border-slate-200 px-10 py-6 rounded-2xl shadow-sm min-w-[300px]">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-bold">Kembalian Anda</p>
                        <p className="text-4xl font-bold text-slate-800 tracking-tight">{formatCurrency(changeAmount)}</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-outfit text-slate-900">
            {/* LEFT: Product List */}
            <div className="flex-1 px-8 py-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="text-green-600" size={24} />
                        <h2 className="text-2xl font-bold tracking-tight">Pesanan</h2>
                    </div>
                </div>

                <div className="grid gap-3">
                    {cart.map((item) => (
                        <div key={item.product_id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                            {item.image_url ? (
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-100">
                                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg">
                                    {item.name.charAt(0)}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg truncate pr-2">{item.name}</h3>
                                <div className="text-slate-500 text-sm">
                                    {formatCurrency(item.price)} <span className="text-slate-300 mx-1">x</span> {item.qty}
                                </div>
                            </div>

                            <div className="text-right whitespace-nowrap">
                                <span className="font-bold text-lg tabular-nums">{formatCurrency(item.price * item.qty)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Payment & Total */}
            <div className="w-[380px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-10 relative">
                <div className="flex-1 p-8 flex flex-col justify-center bg-slate-50/30">
                    {state === "payment" ? (
                        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {paymentMethod === "qris" ? (
                                <>
                                    <h2 className="text-xl font-bold mb-6">Scan QRIS</h2>
                                    {qrisUrl ? (
                                        <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-100 mb-6">
                                            <div className="relative w-64 h-64">
                                                <Image src={qrisUrl} alt="QRIS" fill className="object-contain mix-blend-multiply" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-64 h-64 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                                            <CreditCard size={48} className="text-slate-300" />
                                        </div>
                                    )}
                                    <p className="text-slate-500 text-sm flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        Menunggu pembayaran
                                    </p>
                                </>
                            ) : paymentMethod === "cash" ? (
                                <>
                                    <h2 className="text-xl font-bold mb-6">Pembayaran Tunai</h2>
                                    <div className="w-64 h-64 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                                        <Banknote size={80} className="text-green-600" />
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">
                                        Silakan lakukan pembayaran di kasir
                                    </p>
                                    <p className="text-slate-400 text-xs mt-2">
                                        Mohon tunggu konfirmasi kasir
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold mb-6">Pembayaran Kartu</h2>
                                    <div className="w-64 h-64 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                                        <CreditCard size={80} className="text-blue-600" />
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">
                                        Silakan gunakan mesin EDC
                                    </p>
                                    <p className="text-slate-400 text-xs mt-2">
                                        Debit / Kredit
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center opacity-30">
                            <Store size={64} className="text-slate-400 mb-4" />
                            <p className="text-slate-400 font-medium">Detail pembayaran</p>
                        </div>
                    )}
                </div>
                {/* Total Footer */}
                <div className="p-6 bg-white border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-semibold">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-500">Pajak (10%)</span>
                        <span className="font-semibold">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-3xl font-bold text-green-600">{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Footer Switch Cashier */}
                <div className="p-2 bg-slate-50 text-center border-t border-slate-200">
                    <button
                        onClick={() => setSelectedEmployee(null)}
                        className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Ganti Kasir
                    </button>
                </div>
            </div>
        </div>
    );
}
