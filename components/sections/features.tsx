"use client";

import { useEffect, useRef, useState } from "react";
import {
    CreditCard,
    BarChart3,
    Package,
    Users,
    Shield,
    Smartphone,
} from "lucide-react";

// Removed "Akses Dimana Saja" as requested
const features = [
    {
        icon: CreditCard,
        title: "Transaksi Cepat",
        description:
            "Proses pembayaran dalam hitungan detik dengan antarmuka yang mudah digunakan.",
        size: "normal",
        color: "green",
    },
    {
        icon: BarChart3,
        title: "Laporan Realtime",
        description:
            "Pantau performa bisnis Anda secara langsung dengan dashboard informatif.",
        size: "normal",
        color: "green",
    },
    {
        icon: Package,
        title: "Manajemen Stok",
        description:
            "Kelola inventori dengan mudah. Notifikasi otomatis saat stok menipis.",
        size: "large",
        color: "green", // Changed from "dark" to "green" as requested
    },
    {
        icon: Users,
        title: "Multi-User",
        description:
            "Tambahkan kasir dan staff dengan role berbeda. Pantau aktivitas setiap pengguna.",
        size: "normal",
        color: "green",
    },
    {
        icon: Shield,
        title: "Aman & Terpercaya",
        description:
            "Data bisnis dilindungi dengan enkripsi enterprise. Backup otomatis setiap hari.",
        size: "normal",
        color: "green",
    },
];

function FeatureCard({
    feature,
    index,
    isVisible,
}: {
    feature: (typeof features)[0];
    index: number;
    isVisible: boolean;
}) {
    const isLarge = feature.size === "large";

    return (
        <div
            className={`
        relative overflow-hidden rounded-2xl p-6 lg:p-8 
        transition-all duration-700 ease-out
        ${isLarge ? "md:row-span-2 bg-gradient-to-br from-white to-green-50/50" : "bg-white"}
        border border-gray-100 hover:border-green-200 hover:shadow-xl hover:-translate-y-1
        ${isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }
        group
      `}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Animated Grid Background - Applying to all cards now */}
            <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/30 to-transparent animate-grid-flow" />
            </div>

            {/* Static subtle grid for large card to make it stand out closer to 'andalai.id' style if desired, or just keep consistent */}
            {isLarge && (
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
            )}

            {/* Icon */}
            <div
                className={`
          inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
          transition-transform duration-300 group-hover:scale-110
          bg-green-100 text-green-600
        `}
            >
                <feature.icon className="w-6 h-6" />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-2 text-gray-900">
                {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
                {feature.description}
            </p>

            {/* Visual illustration for larger card (Manajemen Stok) */}
            {isLarge && (
                <div className="mt-8 flex items-center justify-center relative w-full">
                    {/* Preserve height with the outer div as requested by user */}
                    <div className="relative w-full h-[28rem] flex items-center justify-center">
                        {/* Constrained container for the animation to keep icons close */}
                        <div className="relative w-64 h-64">
                            {/* Central Hub */}
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-green-100 flex items-center justify-center animate-pulse-glow">
                                    <Package className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            {/* Orbiting Elements */}
                            <div className="absolute inset-0 animate-spin-slow">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow border border-gray-100 flex items-center justify-center">
                                    <div className="w-4 h-1 bg-green-400 rounded-full" />
                                </div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow border border-gray-100 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full border-2 border-green-400" />
                                </div>
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow border border-gray-100 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-green-200 rounded-sm" />
                                </div>
                                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow border border-gray-100 flex items-center justify-center">
                                    <div className="w-4 h-1 bg-green-400 rounded-full" />
                                </div>
                            </div>

                            {/* Connecting lines */}
                            <svg className="absolute inset-0 w-full h-full text-green-200 animate-spin-slow" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Card-specific illustrations for normal cards */}
            {!isLarge && (
                <div className="mt-6 h-24 flex items-end justify-center w-full">
                    {feature.icon === CreditCard && (
                        <div className="w-full h-full bg-gray-50 rounded-lg p-3 relative overflow-hidden group-hover:bg-green-50/50 transition-colors">
                            <div className="absolute top-3 left-3 w-8 h-5 bg-green-500 rounded flex items-center justify-center">
                                <div className="w-4 h-3 border border-white/30 rounded-sm" />
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 space-y-2">
                                <div className="w-1/2 h-2 bg-gray-200 rounded animate-pulse" />
                                <div className="w-3/4 h-2 bg-gray-200 rounded animate-pulse delay-75" />
                            </div>
                            {/* Animated swipe */}
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-white/50 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                        </div>
                    )}
                    {feature.icon === BarChart3 && (
                        <div className="w-full h-full flex items-end justify-between px-4 pb-2">
                            {[40, 70, 50, 90, 60].map((h, i) => (
                                <div
                                    key={i}
                                    className="w-1/6 bg-green-100 rounded-t-md relative overflow-hidden group-hover:bg-green-200 transition-colors"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute bottom-0 w-full bg-green-500 transition-all duration-700 h-0 group-hover:h-full" />
                                </div>
                            ))}
                        </div>
                    )}
                    {feature.icon === Users && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div className="flex -space-x-4 hover:space-x-1 transition-all duration-300">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center shadow-sm relative z-0 hover:z-10 hover:scale-110 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-green-500 flex items-center justify-center shadow-sm text-white text-xs font-bold relative z-10">
                                    +5
                                </div>
                            </div>
                        </div>
                    )}
                    {feature.icon === Shield && (
                        <div className="flex items-center justify-center w-full h-full">
                            <div className="relative">
                                <Shield className="w-12 h-12 text-gray-200 group-hover:text-green-200 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-300" />
                                </div>
                                {/* Ring animation on hover */}
                                <div className="absolute inset-0 border-2 border-green-500 rounded-full scale-0 opacity-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700 ease-out" />
                                <div className="absolute inset-0 border-2 border-green-500 rounded-full scale-0 opacity-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700 ease-out delay-150" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Bottom accent line */}
            <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            />
        </div>
    );
}

export function Features() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="features" className="py-20 lg:py-32 bg-gray-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div
                    className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                        }`}
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Fitur Lengkap untuk{" "}
                        <span className="text-gradient-primary">Bisnis Modern</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Semua yang Anda butuhkan untuk mengelola bisnis retail atau F&B
                        dalam satu platform terintegrasi.
                    </p>
                </div>

                {/* Bento grid - Adjusted for 5 items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Column 1: Two standard cards */}
                    <div className="flex flex-col gap-6">
                        <FeatureCard feature={features[0]} index={0} isVisible={isVisible} />
                        <FeatureCard feature={features[3]} index={3} isVisible={isVisible} />
                    </div>

                    {/* Column 2: Large card spanning 2 cols or 1 col depending on design preference. 
             Ideally:
             [ Card 1 ] [ Card 3 (Large) ] [ Card 2 ]
             [ Card 4 ] [           ] [ Card 5 ]
             
             Let's try a 3-column layout where the middle one is tall.
          */}

                    <div className="md:col-span-1 flex flex-col gap-6">
                        {/* This is the large "Manajemen Stok" card */}
                        <div className="h-full">
                            <FeatureCard feature={features[2]} index={2} isVisible={isVisible} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <FeatureCard feature={features[1]} index={1} isVisible={isVisible} />
                        <FeatureCard feature={features[4]} index={4} isVisible={isVisible} />
                    </div>
                </div>

                {/* Alternative Grid Layout if the above is too narrow for "Large" card */}
                {/* 
            Row 1: [Small] [Large - Spanning 2 rows?] [Small]
            Row 2: [Small]                        [Small]
            
            With 5 items:
            [ S ] [ L ] [ S ]
            [ S ] [ L ] [ S ]
         */}

            </div>
        </section>
    );
}
