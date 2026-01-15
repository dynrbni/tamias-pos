import { Card, CardContent } from "@/components/ui/card";
import {
    CreditCard,
    BarChart3,
    Package,
    Users,
    Shield,
    Smartphone,
} from "lucide-react";

const features = [
    {
        icon: CreditCard,
        title: "Transaksi Cepat",
        description:
            "Proses pembayaran dalam hitungan detik dengan antarmuka yang mudah digunakan. Mendukung berbagai metode pembayaran.",
    },
    {
        icon: BarChart3,
        title: "Laporan Realtime",
        description:
            "Pantau performa bisnis Anda secara langsung dengan dashboard yang informatif dan laporan yang komprehensif.",
    },
    {
        icon: Package,
        title: "Manajemen Stok",
        description:
            "Kelola inventori dengan mudah. Notifikasi otomatis saat stok menipis dan pelacakan produk yang akurat.",
    },
    {
        icon: Users,
        title: "Multi-User",
        description:
            "Tambahkan kasir dan staff dengan role berbeda. Pantau aktivitas setiap pengguna dengan log yang detail.",
    },
    {
        icon: Shield,
        title: "Aman & Terpercaya",
        description:
            "Data bisnis Anda dilindungi dengan enkripsi tingkat enterprise. Backup otomatis setiap hari.",
    },
    {
        icon: Smartphone,
        title: "Akses Dimana Saja",
        description:
            "Kelola bisnis dari mana saja melalui smartphone atau tablet. Sinkronisasi data secara realtime.",
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 lg:py-32 bg-gray-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Fitur Lengkap untuk{" "}
                        <span className="text-gradient-primary">Bisnis Modern</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Semua yang Anda butuhkan untuk mengelola bisnis retail atau F&B
                        dalam satu platform terintegrasi.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
                        >
                            <CardContent className="p-6 lg:p-8">
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary-light text-green-700 mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover decoration */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
