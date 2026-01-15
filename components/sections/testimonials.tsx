import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Rina Susanti",
        role: "Pemilik Toko Kelontong",
        location: "Jakarta",
        avatar: "RS",
        rating: 5,
        content:
            "Sebelum pakai Tamias POS, saya masih catat manual. Sekarang semua otomatis, laporan jelas, dan stock tercontrol dengan baik. Sangat membantu!",
    },
    {
        name: "Budi Hartono",
        role: "Owner Restoran",
        location: "Surabaya",
        avatar: "BH",
        rating: 5,
        content:
            "Pelayanan lebih cepat karena order langsung masuk ke dapur. Customer jadi lebih puas dan omset meningkat 30% dalam 3 bulan pertama.",
    },
    {
        name: "Dewi Lestari",
        role: "Manager Cafe",
        location: "Bandung",
        avatar: "DL",
        rating: 5,
        content:
            "Interface-nya user friendly banget, kasir baru cepat belajar. Report penjualan juga lengkap, jadi mudah analisa produk mana yang laku.",
    },
    {
        name: "Ahmad Fadli",
        role: "Pemilik Minimarket",
        location: "Yogyakarta",
        avatar: "AF",
        rating: 5,
        content:
            "Support-nya responsif dan helpful. Setiap ada masalah langsung dibantu. Harga juga terjangkau untuk fitur selengkap ini.",
    },
    {
        name: "Siti Nurhaliza",
        role: "Owner Butik",
        location: "Medan",
        avatar: "SN",
        rating: 5,
        content:
            "Bisa pantau penjualan dari HP kapanpun. Meski tidak di toko, tetap bisa tahu kondisi bisnis secara realtime. Sangat praktis!",
    },
    {
        name: "Rudi Prasetyo",
        role: "Franchise Owner",
        location: "Bali",
        avatar: "RP",
        rating: 5,
        content:
            "Dengan fitur multi-cabang, saya bisa kelola 5 outlet sekaligus dari satu dashboard. Game changer untuk bisnis franchise!",
    },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="py-20 lg:py-32 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Dipercaya oleh{" "}
                        <span className="text-gradient-primary">Ribuan Bisnis</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Dengar langsung dari pelanggan kami yang telah merasakan manfaat
                        Tamias POS.
                    </p>
                </div>

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="group border shadow-sm hover:shadow-lg transition-shadow duration-300"
                        >
                            <CardContent className="p-6">
                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    &quot;{testimonial.content}&quot;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 border-2 border-green-100">
                                        <AvatarFallback className="bg-green-50 text-green-700 font-medium text-sm">
                                            {testimonial.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {testimonial.role} • {testimonial.location}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
