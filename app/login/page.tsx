"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [error, setError] = useState("");

    // Check if already logged in
    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (isMounted && session) {
                    router.replace("/dashboard");
                }
            } catch (err) {
                // Ignore abort errors
                if (err instanceof Error && err.name === 'AbortError') return;
                console.error("Session check error:", err);
            } finally {
                if (isMounted) {
                    setIsCheckingAuth(false);
                }
            }
        };

        checkSession();

        return () => {
            isMounted = false;
        };
    }, [router]);

    // Form validation
    const validateForm = (): string | null => {
        if (!email.trim()) {
            return "Email wajib diisi";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Format email tidak valid";
        }
        if (!password) {
            return "Password wajib diisi";
        }
        if (password.length < 6) {
            return "Password minimal 6 karakter";
        }
        return null;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

            if (authError) {
                if (authError.message.includes("Invalid login credentials")) {
                    throw new Error("Email atau password salah.");
                }
                if (authError.message.includes("Email not confirmed")) {
                    throw new Error("Email belum diverifikasi. Cek inbox email Anda.");
                }
                throw new Error(authError.message);
            }

            if (!data.session) {
                throw new Error("Login gagal. Silakan coba lagi.");
            }

            // Success - redirect to dashboard
            router.push("/dashboard");

        } catch (err: any) {
            // Ignore abort errors
            if (err.name === 'AbortError') return;
            setError(err.message || "Login gagal. Periksa email dan password Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            setError(err.message || "Login dengan Google gagal.");
        }
    };

    // Show loading while checking existing session
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Login</h1>
                        <p className="text-balance text-muted-foreground">
                            Masukan email dan password untuk login
                        </p>
                    </div>
                    <form onSubmit={handleLogin} className="grid gap-4">
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
                            <div className="flex items-center">
                                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-foreground"
                                >
                                    Lupa password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
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
                            {isLoading ? "Memproses..." : "Login"}
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
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Login dengan Google
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Belum punya akun?{" "}
                        <Link href="/register" className="underline text-green-600 font-medium">
                            Daftar sekarang
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-green-50 lg:flex items-center justify-center p-8">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white p-12 text-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Kelola Bisnis Lebih Cerdas</h2>
                        <p className="text-lg opacity-90">Satu platform untuk semua kebutuhan bisnis retail dan F&B Anda.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
