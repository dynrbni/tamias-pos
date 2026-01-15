import { UserPlus, Settings, ShoppingCart } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: UserPlus,
        title: "Daftar Akun",
        description:
            "Buat akun gratis dalam hitungan menit. Tidak memerlukan kartu kredit untuk memulai.",
    },
    {
        number: "02",
        icon: Settings,
        title: "Setup Produk",
        description:
            "Tambahkan produk, kategori, dan atur harga dengan mudah melalui dashboard yang intuitif.",
    },
    {
        number: "03",
        icon: ShoppingCart,
        title: "Mulai Berjualan",
        description:
            "Langsung gunakan untuk transaksi sehari-hari. Laporan dan analitik tersedia secara otomatis.",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 lg:py-32 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Mulai dalam{" "}
                        <span className="text-gradient-primary">3 Langkah Mudah</span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Tidak perlu setup yang rumit. Tamias POS dirancang agar Anda bisa
                        langsung menggunakannya.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Connection line - desktop */}
                    <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <div key={index} className="relative text-center">
                                {/* Step number with icon */}
                                <div className="relative inline-flex flex-col items-center">
                                    <div className="flex items-center justify-center w-20 h-20 rounded-full gradient-primary shadow-lg shadow-green-500/25 mb-6">
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-green-500 text-sm font-bold text-green-600">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground max-w-xs mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
