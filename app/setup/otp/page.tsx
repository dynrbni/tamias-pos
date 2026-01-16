"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OTPPage() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [isDevMode, setIsDevMode] = useState(false);

    useEffect(() => {
        // Get pending registration data
        const pendingData = localStorage.getItem("pendingRegistration");
        if (pendingData) {
            const { email: storedEmail } = JSON.parse(pendingData);
            setEmail(storedEmail);
        } else {
            // No pending registration, redirect to register
            router.push("/register");
        }
    }, [router]);

    useEffect(() => {
        // Countdown timer for resend
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) {
            setError("Silakan masukkan kode 6 digit.");
            return;
        }

        setIsLoading(true);

        try {
            // Verify OTP with Supabase
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: "signup",
            });

            if (verifyError) {
                // If OTP fails, show specific error
                throw new Error("Kode OTP tidak valid atau sudah kadaluarsa.");
            }

            if (!data.user) {
                throw new Error("Verifikasi gagal. Silakan coba lagi.");
            }

            // OTP verified - create store and redirect to dashboard
            await createStoreAfterVerification(data.user.id);

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Kode OTP tidak valid. Silakan coba lagi.");
            setIsLoading(false);
        }
    };

    const createStoreAfterVerification = async (userId: string) => {
        const pendingData = localStorage.getItem("pendingRegistration");
        if (pendingData) {
            const { storeName, fullName } = JSON.parse(pendingData);

            // Create store
            const { data: storeData, error: storeError } = await supabase
                .from("stores")
                .insert([{ name: storeName, owner_id: userId }])
                .select()
                .single();

            if (!storeError && storeData) {
                // Update profile with store_id
                await supabase
                    .from("profiles")
                    .update({
                        store_id: storeData.id,
                        full_name: fullName,
                        role: "owner"
                    })
                    .eq("id", userId);
            }

            localStorage.removeItem("pendingRegistration");
        }
    };

    // Dev mode: Skip OTP (for testing when email not working)
    const handleDevSkip = async () => {
        setIsLoading(true);
        setError("");

        try {
            // Get current session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                await createStoreAfterVerification(session.user.id);
                router.push("/dashboard");
            } else {
                setError("Tidak ada sesi aktif. Silakan register ulang.");
            }
        } catch (err: any) {
            setError(err.message || "Gagal skip verifikasi.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        setIsResending(true);
        setError("");

        try {
            const { error: resendError } = await supabase.auth.resend({
                type: "signup",
                email,
            });

            if (resendError) throw resendError;

            setCountdown(60);
        } catch (err: any) {
            setError(err.message || "Gagal mengirim ulang kode.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6 text-center">
            <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-green-600" />
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Verifikasi Email</h1>
                <p className="text-sm text-muted-foreground">
                    Masukkan 6 digit kode yang telah kami kirim ke
                </p>
                {email && (
                    <p className="text-sm font-medium text-green-600">{email}</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
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

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading || otp.length < 6}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verifikasi
                </Button>
            </form>

            <div className="text-center text-sm space-y-4">
                <p className="text-muted-foreground">
                    Tidak menerima kode?{" "}
                    <button
                        type="button"
                        className={`font-medium ${countdown > 0
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-green-600 hover:text-green-500"
                            }`}
                        onClick={handleResend}
                        disabled={countdown > 0 || isResending}
                    >
                        {isResending ? (
                            <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                        ) : null}
                        {countdown > 0 ? `Kirim ulang (${countdown}s)` : "Kirim Ulang"}
                    </button>
                </p>

                {/* Dev mode toggle */}
                <div className="pt-4 border-t">
                    <button
                        type="button"
                        className="text-xs text-gray-400 hover:text-gray-600"
                        onClick={() => setIsDevMode(!isDevMode)}
                    >
                        {isDevMode ? "Sembunyikan opsi dev" : "Mode development"}
                    </button>

                    {isDevMode && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-xs text-yellow-700 mb-2">
                                ⚠️ Hanya untuk testing (email tidak terkirim)
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full text-yellow-700 border-yellow-300"
                                onClick={handleDevSkip}
                                disabled={isLoading}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Skip Verifikasi (Dev)
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
