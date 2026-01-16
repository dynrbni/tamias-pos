"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, Mail, ArrowLeft, CheckCircle, Store, MapPin, Phone } from "lucide-react";

type RegisterStep = "form" | "otp" | "store_setup" | "success";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<RegisterStep>("form");

    // Form state
    const [storeName, setStoreName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // OTP state
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(0);

    // Store setup state
    const [storeAddress, setStoreAddress] = useState("");
    const [storePhone, setStorePhone] = useState("");
    const [storeDescription, setStoreDescription] = useState("");

    // User data after OTP
    const [userId, setUserId] = useState<string | null>(null);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Form validation
    const validateForm = (): string | null => {
        if (!storeName.trim()) return "Nama toko wajib diisi";
        if (!firstName.trim()) return "Nama depan wajib diisi";
        if (!lastName.trim()) return "Nama belakang wajib diisi";
        if (!email.trim()) return "Email wajib diisi";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format email tidak valid";
        if (!password) return "Password wajib diisi";
        if (password.length < 6) return "Password minimal 6 karakter";
        return null;
    };

    // Step 1: Submit form & send OTP
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: {
                        full_name: `${firstName.trim()} ${lastName.trim()}`,
                        store_name: storeName.trim(),
                    },
                },
            });

            if (authError) {
                if (authError.message.includes("User already registered")) {
                    throw new Error("Email sudah terdaftar. Silakan login.");
                }
                throw new Error(authError.message);
            }

            if (!data.user) {
                throw new Error("Registrasi gagal. Silakan coba lagi.");
            }

            if (data.user.identities?.length === 0) {
                throw new Error("Email sudah terdaftar. Silakan login.");
            }

            setStep("otp");
            setCountdown(60);

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Registrasi gagal. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError("Masukkan kode OTP 6 digit");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token: otp,
                type: "signup",
            });

            if (verifyError) {
                throw new Error("Kode OTP tidak valid atau sudah kadaluarsa.");
            }

            if (!data.user || !data.session) {
                throw new Error("Verifikasi gagal. Silakan coba lagi.");
            }

            // Save user ID and move to store setup
            setUserId(data.user.id);
            setStep("store_setup");

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Verifikasi OTP gagal.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Setup store
    const handleSetupStore = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!storeAddress.trim()) {
            setError("Alamat toko wajib diisi");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            // Create store - only include fields we know exist
            const storePayload: any = {
                name: storeName.trim(),
                address: storeAddress.trim(),
                owner_id: userId
            };

            // Only add phone if provided
            if (storePhone.trim()) {
                storePayload.phone = storePhone.trim();
            }

            const { data: storeData, error: storeError } = await supabase
                .from("stores")
                .insert([storePayload])
                .select()
                .single();

            if (storeError) {
                console.error("Store error:", storeError.message || storeError);
                throw new Error(storeError.message || "Gagal membuat toko. Silakan coba lagi.");
            }

            // Update profile with store_id
            const { error: profileError } = await supabase
                .from("profiles")
                .upsert([{
                    id: userId,
                    full_name: `${firstName.trim()} ${lastName.trim()}`,
                    store_id: storeData.id,
                    role: "owner"
                }]);

            if (profileError) {
                console.error("Profile error:", profileError);
            }

            setStep("success");

            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Setup toko gagal.");
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (countdown > 0) return;

        setError("");
        setIsLoading(true);

        try {
            const { error: resendError } = await supabase.auth.resend({
                type: "signup",
                email: email.trim(),
            });

            if (resendError) throw resendError;

            setCountdown(60);
            setOtp("");

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Gagal mengirim ulang OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    // Google signup
    const handleGoogleSignUp = async () => {
        setError("");
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?setup=true`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Registrasi dengan Google gagal.");
        }
    };

    // Success screen
    if (step === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold">Toko Berhasil Dibuat!</h1>
                    <p className="text-muted-foreground">
                        <span className="font-semibold text-green-600">{storeName}</span> siap digunakan.
                    </p>
                    <p className="text-sm text-muted-foreground">Mengalihkan ke dashboard...</p>
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
                </div>
            </div>
        );
    }

    // Store setup screen
    if (step === "store_setup") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Store className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold">Setup Toko Anda</h1>
                        <p className="text-sm text-muted-foreground">
                            Lengkapi informasi toko untuk memulai
                        </p>
                    </div>

                    <form onSubmit={handleSetupStore} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Nama Toko</Label>
                            <Input
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                placeholder="Nama toko"
                                className="bg-gray-50"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                Alamat Toko <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="address"
                                value={storeAddress}
                                onChange={(e) => {
                                    setStoreAddress(e.target.value);
                                    setError("");
                                }}
                                placeholder="Jl. Pahlawan No. 123, Kota ABC"
                                rows={2}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">
                                <Phone className="w-4 h-4 inline mr-1" />
                                No. Telepon Toko
                            </Label>
                            <Input
                                id="phone"
                                value={storePhone}
                                onChange={(e) => setStorePhone(e.target.value)}
                                placeholder="0812-xxxx-xxxx"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi (Opsional)</Label>
                            <Textarea
                                id="description"
                                value={storeDescription}
                                onChange={(e) => setStoreDescription(e.target.value)}
                                placeholder="Warung kelontong 24 jam..."
                                rows={2}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Menyimpan..." : "Buat Toko & Masuk Dashboard"}
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    // OTP verification screen
    if (step === "otp") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                    <button
                        onClick={() => {
                            setStep("form");
                            setOtp("");
                            setError("");
                        }}
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Kembali
                    </button>

                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold">Verifikasi Email</h1>
                        <p className="text-sm text-muted-foreground">
                            Masukkan kode OTP yang dikirim ke
                        </p>
                        <p className="font-medium text-green-600">{email}</p>
                    </div>

                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => {
                                    setOtp(value);
                                    setError("");
                                }}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={isLoading || otp.length < 6}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verifikasi
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <p className="text-muted-foreground">
                            Tidak menerima kode?{" "}
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={countdown > 0 || isLoading}
                                className={`font-medium ${countdown > 0
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-green-600 hover:text-green-500"
                                    }`}
                            >
                                {countdown > 0 ? `Kirim ulang (${countdown}s)` : "Kirim Ulang"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Registration form
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Daftar Akun</h1>
                        <p className="text-balance text-muted-foreground">
                            Isi data untuk membuat akun baru
                        </p>
                    </div>
                    <form onSubmit={handleSubmitForm} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="store">Nama Toko <span className="text-red-500">*</span></Label>
                            <Input
                                id="store"
                                placeholder="Warung Sejahtera"
                                value={storeName}
                                onChange={(e) => {
                                    setStoreName(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">Nama Depan <span className="text-red-500">*</span></Label>
                                <Input
                                    id="first-name"
                                    placeholder="Budi"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Nama Belakang <span className="text-red-500">*</span></Label>
                                <Input
                                    id="last-name"
                                    placeholder="Santoso"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="contoh@email.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Minimal 6 karakter"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Memproses..." : "Lanjutkan"}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Atau
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignUp}
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Daftar dengan Google
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="underline text-green-600 font-medium">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-green-50 lg:flex items-center justify-center p-8">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white p-12 text-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Bergabung dengan Tamias POS</h2>
                        <p className="text-lg opacity-90">Mulai kelola bisnis Anda dengan cara yang lebih baik.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
