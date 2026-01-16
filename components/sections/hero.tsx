"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    Play,
    Sparkles,
    CreditCard,
    Receipt,
    Package,
    BarChart3,
} from "lucide-react";

// Lightweight animated squares component - CSS only, no heavy JS
function AnimatedSquares() {
    // Generate random positions only once on mount
    const squares = useMemo(() => {
        return Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: `${(i * 7) % 100}%`,
            top: `${(i * 11) % 100}%`,
            delay: `${(i * 0.5) % 5}s`,
            duration: `${4 + (i % 3)}s`,
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {squares.map((square) => (
                <div
                    key={square.id}
                    className="absolute w-16 h-16 border border-green-300/30 rounded-sm animate-square-fade"
                    style={{
                        left: square.left,
                        top: square.top,
                        animationDelay: square.delay,
                        animationDuration: square.duration,
                    }}
                />
            ))}
        </div>
    );
}

export function Hero() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Grid background */}
            <div className="absolute inset-0 -z-10">
                {/* Static grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-[size:3rem_3rem]" />

                {/* Radial mask */}
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_40%,transparent_100%)]">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98118_1px,transparent_1px),linear-gradient(to_bottom,#10b98118_1px,transparent_1px)] bg-[size:3rem_3rem]" />
                </div>
            </div>

            {/* Animated squares overlay */}
            <AnimatedSquares />

            {/* Simple gradient blobs */}
            <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-300/15 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div
                        className={`inline-flex items-center gap-2 mb-6 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        <Badge
                            variant="secondary"
                            className="px-4 py-1.5 text-sm border border-green-200 bg-green-50 text-green-700"
                        >
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Aplikasi Kasir Terbaik di Indonesia
                        </Badge>
                    </div>

                    {/* Headline with gradient and underline */}
                    <h1
                        className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-all duration-500 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        Kelola Bisnis{" "}
                        <span className="relative inline-block">
                            <span className="text-gradient-primary">Lebih Cerdas</span>
                            {/* Animated underline */}
                            <svg
                                className="absolute -bottom-1 left-0 w-full h-3 overflow-visible"
                                viewBox="0 0 200 12"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0,8 Q50,2 100,8 T200,8"
                                    fill="none"
                                    stroke="url(#underline-gradient)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    className="animate-draw-line"
                                />
                                <defs>
                                    <linearGradient id="underline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="50%" stopColor="#34d399" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>{" "}
                        dengan Tamias POS
                    </h1>

                    {/* Subheadline */}
                    <p
                        className={`mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        Sistem Point of Sale modern yang membantu Anda mengelola transaksi,
                        inventori, dan laporan bisnis dalam satu platform yang mudah
                        digunakan.
                    </p>

                    {/* CTA Buttons */}
                    <div
                        className={`mt-10 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-500 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        <Button
                            size="lg"
                            className="gradient-primary hover:opacity-90 transition-opacity text-base px-8 h-12 shadow-lg shadow-green-500/25"
                        >
                            Mulai Gratis Sekarang
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-base px-8 h-12 border-2 hover:bg-green-50 transition-colors"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Lihat Demo
                        </Button>
                    </div>

                    {/* Social proof */}
                    <div
                        className={`mt-12 transition-all duration-500 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        <p className="text-sm text-muted-foreground mb-4">
                            Dipercaya oleh{" "}
                            <span className="font-semibold text-green-600">1000+</span> bisnis
                            di Indonesia
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 items-center">
                            {["Toko A", "Restoran B", "Cafe C", "Retail D", "Mart E"].map(
                                (name, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-center w-24 h-10 bg-white/80 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-600 border shadow-sm"
                                    >
                                        {name}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div
                    className={`mt-16 lg:mt-20 relative transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    <div className="relative mx-auto max-w-5xl">
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-green-500/10 via-green-400/20 to-green-500/10 rounded-2xl blur-2xl" />

                        {/* Dashboard mockup */}
                        <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                            {/* Browser bar */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="bg-white rounded-md px-3 py-1.5 text-xs text-gray-500 border max-w-md mx-auto flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        app.tamias-pos.com
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard content */}
                            <div className="relative bg-gray-50">
                                <img
                                    src="/images/dashboard-mockup.png"
                                    alt="Tamias POS Dashboard Preview"
                                    className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity duration-700"
                                    width={1440}
                                    height={900}
                                />
                                {/* Overlay gradient for better blending if needed */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
                <svg
                    className="absolute bottom-0 w-full h-16 text-gray-50"
                    viewBox="0 0 1440 74"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,37.3C960,32,1056,32,1152,37.3C1248,43,1344,53,1392,58.7L1440,64L1440,74L0,74Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        </section>
    );
}
