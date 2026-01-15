"use client";

import { useEffect, useRef, useState } from "react";
import { UserPlus, Settings, ShoppingCart } from "lucide-react";

export function HowItWorks() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const steps = [
        {
            number: "01",
            icon: UserPlus,
            title: "Daftar Akun",
            description: "Buat akun gratis dalam hitungan menit tanpa kartu kredit.",
        },
        {
            number: "02",
            icon: Settings,
            title: "Setup Produk",
            description: "Input produk dan atur harga dengan dashboard intuitif.",
        },
        {
            number: "03",
            icon: ShoppingCart,
            title: "Mulai Berjualan",
            description: "Langsung gunakan untuk transaksi bisnis Anda sehari-hari.",
        },
    ];

    return (
        <section ref={sectionRef} id="how-it-works" className="py-20 lg:py-32 relative overflow-hidden bg-white">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-100 to-transparent -translate-y-1/2 hidden lg:block" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h2
                        className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        Mulai dalam <span className="text-gradient-primary">3 Langkah</span>
                    </h2>
                    <p
                        className={`mt-4 text-lg text-muted-foreground transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        Proses setup yang cepat dan mudah agar Anda bisa langsung fokus berjualan.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Animated Path (Desktop) */}
                    <div className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 hidden lg:block pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                            <path
                                d="M0,50 Q250,50 500,50 T1000,50"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="2"
                                strokeDasharray="8 8"
                            />
                            <path
                                d="M0,50 Q250,50 500,50 T1000,50"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2"
                                strokeDasharray="1000"
                                strokeDashoffset={isVisible ? "0" : "1000"}
                                className="transition-all duration-[2s] ease-in-out"
                            />
                        </svg>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`relative group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                    }`}
                                style={{ transitionDelay: `${index * 300}ms` }}
                            >
                                {/* Horizontal Connector Line (Mobile) */}
                                {index !== steps.length - 1 && (
                                    <div className="absolute bottom-[-3rem] left-1/2 w-0.5 h-12 bg-gray-200 lg:hidden -translate-x-1/2">
                                        <div className={`w-full bg-green-500 transition-all duration-1000 delay-[${index * 500}ms] ${isVisible ? "h-full" : "h-0"}`} />
                                    </div>
                                )}

                                <div
                                    className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 relative overflow-hidden"
                                >
                                    {/* Decorative number background */}
                                    <span className="absolute -right-4 -top-6 text-9xl font-bold text-gray-50/80 select-none group-hover:text-green-50/50 transition-colors duration-300">
                                        {step.number}
                                    </span>

                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-green-200/50">
                                            <step.icon className="w-8 h-8 text-green-600" />
                                        </div>

                                        <h3 className="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Floating dot on the line */}
                                <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-md -translate-x-1/2 -translate-y-1/2 hidden lg:block z-20 scale-0 animate-fade-in-up"
                                    style={{
                                        animationDelay: `${1.5 + (index * 0.5)}s`,
                                        animationFillMode: 'forwards'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
