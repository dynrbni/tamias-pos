"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Settings,
    BarChart3,
    LogOut,
    FileText,
    Tag,
    ClipboardList,
    UserCog,
    Store as StoreIcon,
    ChevronDown
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const [storeName, setStoreName] = useState<string>("Memuat...");
    const [storeAddress, setStoreAddress] = useState<string>("");

    useEffect(() => {
        loadStore();
    }, []);

    const loadStore = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get profile to find store_id
            const { data: profile } = await supabase
                .from("profiles")
                .select("store_id")
                .eq("id", user.id)
                .single();

            if (profile?.store_id) {
                // Get store details
                const { data: store } = await supabase
                    .from("stores")
                    .select("name, address")
                    .eq("id", profile.store_id)
                    .single();

                if (store) {
                    setStoreName(store.name);
                    setStoreAddress(store.address || "");
                }
            } else {
                setStoreName("Setup Toko");
            }
        } catch (err) {
            console.error("Load store error:", err);
            setStoreName("Toko Saya");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className={cn("pb-12 bg-white border-r h-full flex flex-col", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    {/* Store Header */}
                    <Link href="/dashboard" className="flex items-center px-4 mb-6">
                        <span className="text-xl font-bold text-foreground">
                            Tamias<span className="text-green-600">POS</span>
                        </span>
                    </Link>
                    <div className="px-2 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                <StoreIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{storeName}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {storeAddress || "Dashboard Toko"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Home Section */}
                    <div className="px-2 mb-2">
                        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
                            Home
                        </h2>
                        <div className="space-y-1">
                            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                            <Button variant={pathname?.startsWith("/dashboard/transactions") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard/transactions">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Transaksi
                                </Link>
                            </Button>
                            <Button variant={pathname?.startsWith("/dashboard/products") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard/products">
                                    <Package className="mr-2 h-4 w-4" />
                                    Produk
                                </Link>
                            </Button>
                            <Button variant={pathname?.startsWith("/dashboard/customers") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard/customers">
                                    <Users className="mr-2 h-4 w-4" />
                                    Member Toko
                                </Link>
                            </Button>
                            <Button variant={pathname?.startsWith("/dashboard/promos") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard/promos">
                                    <Tag className="mr-2 h-4 w-4" />
                                    Promo &amp; Diskon
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Karyawan Section */}
                    <div className="px-2 mb-2 mt-4">
                        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
                            Karyawan
                        </h2>
                        <div className="space-y-1">
                            <Button variant={pathname?.startsWith("/dashboard/employees") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard/employees">
                                    <UserCog className="mr-2 h-4 w-4" />
                                    Manajemen Karyawan
                                </Link>
                            </Button>
                            <Button variant={pathname?.startsWith("/dashboard/employee-logs") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard/employee-logs">
                                    <ClipboardList className="mr-2 h-4 w-4" />
                                    Log Aktivitas
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Laporan Section */}
                    <div className="px-2 mb-2 mt-4">
                        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
                            Laporan
                        </h2>
                        <div className="space-y-1">
                            <Button variant={pathname?.startsWith("/dashboard/reports") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard/reports">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Analitik
                                </Link>
                            </Button>
                            <Button variant={pathname?.startsWith("/dashboard/invoices") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard/invoices">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Faktur
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Bantuan Section */}
                    <div className="px-2 mb-2 mt-4">
                        <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
                            Lainnya
                        </h2>
                        <div className="space-y-1">
                            <Button variant={pathname?.startsWith("/dashboard/settings") ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Pengaturan
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                </Button>
            </div>
        </div>
    );
}
