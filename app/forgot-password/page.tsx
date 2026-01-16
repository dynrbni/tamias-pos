"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, Mail, ArrowLeft, CheckCircle, KeyRound, Eye, EyeOff } from "lucide-react";

type ForgotPasswordStep = "email" | "otp" | "new_password" | "success";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<ForgotPasswordStep>("email");

    // Form state
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Step 1: Send OTP to email
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Email wajib diisi");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Format email tidak valid");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/forgot-password?step=reset`,
            });

            if (resetError) {
                throw new Error(resetError.message);
            }

            setStep("otp");
            setCountdown(60);

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Gagal mengirim OTP. Silakan coba lagi.");
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
                type: "recovery",
            });

            if (verifyError) {
                throw new Error("Kode OTP tidak valid atau sudah kadaluarsa.");
            }

            if (!data.session) {
                throw new Error("Verifikasi gagal. Silakan coba lagi.");
            }

            setStep("new_password");

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Verifikasi OTP gagal.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Set new password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword) {
            setError("Password baru wajib diisi");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Konfirmasi password tidak cocok");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                throw new Error(updateError.message);
            }

            setStep("success");

            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Gagal mengubah password.");
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
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/forgot-password?step=reset`,
            });

            if (resetError) throw resetError;

            setCountdown(60);
            setOtp("");

        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Gagal mengirim ulang OTP.");
        } finally {
            setIsLoading(false);
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
                    <h1 className="text-2xl font-bold">Password Berhasil Diubah!</h1>
                    <p className="text-muted-foreground">
                        Silakan login dengan password baru Anda.
                    </p>
                    <p className="text-sm text-muted-foreground">Mengalihkan ke halaman login...</p>
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600" />
                </div>
            </div>
        );
    }

    // New password screen
    if (step === "new_password") {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <KeyRound className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold">Buat Password Baru</h1>
                        <p className="text-sm text-muted-foreground">
                            Masukkan password baru untuk akun Anda
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">Password Baru</Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimal 6 karakter"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setError("");
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                            <Input
                                id="confirm-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Ulangi password baru"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
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
                            {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
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
                            setStep("email");
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

    // Email input screen (default)
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
                <Link
                    href="/login"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali ke Login
                </Link>

                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <KeyRound className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold">Lupa Password?</h1>
                    <p className="text-sm text-muted-foreground">
                        Masukkan email Anda untuk menerima kode OTP
                    </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
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
                        {isLoading ? "Mengirim..." : "Kirim Kode OTP"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Ingat password Anda?{" "}
                        <Link href="/login" className="text-green-600 font-medium hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
