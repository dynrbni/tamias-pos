import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Daftar Akun</h1>
                        <p className="text-balance text-muted-foreground">
                            Masukan informasi anda untuk membuat akun baru
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Nama Toko</Label>
                        <Input
                            id="toko"
                            placeholder="Warung Madurskuy"
                            required
                        />
                    </div>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first-name">Nama Depan</Label>
                                <Input id="first-name" placeholder="Max" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last-name">Nama Belakang</Label>
                                <Input id="last-name" placeholder="Robinson" required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                        <Link href="/dashboard" className="w-full">
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                                Buat Akun
                            </Button>
                        </Link>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full">
                            <svg
                                className="mr-2 h-4 w-4"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Login with Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="underline text-green-600">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-green-50 lg:flex items-center justify-center p-8">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white p-12 text-center">
                    {/* Placeholder for user image */}
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Bergabung dengan Tamias POS</h2>
                        <p className="text-lg opacity-90">Mulai kelola bisnis Anda dengan cara yang lebih baik.</p>
                        <div className="mt-12 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                            <p className="text-sm">"Area ini disiapkan untuk gambar/ilustrasi branding Anda"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
