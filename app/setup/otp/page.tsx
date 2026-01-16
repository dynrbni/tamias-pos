"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

export default function OTPPage() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) {
            setError("Silakan masukkan kode 6 digit.");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // For dummy purpose, accept "123456" or any code
            router.push("/setup/subscription");
        }, 1500);
    };

    return (
        <div className="space-y-6 text-center">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Verifikasi Akun</h1>
                <p className="text-sm text-muted-foreground">
                    Masukkan 6 digit kode yang telah kami kirim ke email Anda.
                </p>
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

            <div className="text-center text-sm">
                <p className="text-muted-foreground">
                    Tidak menerima kode?{" "}
                    <button
                        type="button"
                        className="font-medium text-green-600 hover:text-green-500"
                        onClick={() => alert("Kode dikirim ulang!")}
                    >
                        Kirim Ulang
                    </button>
                </p>
            </div>
        </div>
    );
}
