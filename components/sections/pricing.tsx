import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Starter",
        description: "Untuk bisnis kecil yang baru memulai",
        price: "Gratis",
        period: "selamanya",
        popular: false,
        features: [
            "1 Kasir",
            "100 Produk",
            "Laporan Harian",
            "Transaksi Unlimited",
            "Support Email",
        ],
        cta: "Mulai Gratis",
        variant: "outline" as const,
    },
    {
        name: "Pro",
        description: "Untuk bisnis yang sedang berkembang",
        price: "Rp 199.000",
        period: "/bulan",
        popular: true,
        features: [
            "5 Kasir",
            "Unlimited Produk",
            "Laporan Lengkap",
            "Multi-Cabang",
            "Integrasi E-Commerce",
            "Support Priority",
            "Export Data",
        ],
        cta: "Pilih Pro",
        variant: "default" as const,
    },
    {
        name: "Enterprise",
        description: "Untuk bisnis skala besar",
        price: "Custom",
        period: "hubungi kami",
        popular: false,
        features: [
            "Unlimited Kasir",
            "Unlimited Produk",
            "Analitik Advanced",
            "API Access",
            "White Label",
            "Dedicated Support",
            "SLA 99.9%",
            "Training & Onboarding",
        ],
        cta: "Hubungi Sales",
        variant: "outline" as const,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-20 lg:py-32 bg-gray-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Harga <span className="text-gradient-primary">Transparan</span> &
                        Terjangkau
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Upgrade atau
                        downgrade kapan saja.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative overflow-hidden ${plan.popular
                                    ? "border-2 border-green-500 shadow-xl shadow-green-500/10"
                                    : "border shadow-sm"
                                }`}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute top-0 right-0">
                                    <Badge className="rounded-none rounded-bl-lg gradient-primary px-3 py-1">
                                        Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {plan.description}
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Price */}
                                <div>
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground ml-1">
                                        {plan.period}
                                    </span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-green-600" />
                                            </div>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <Button
                                    className={`w-full ${plan.popular
                                            ? "gradient-primary hover:opacity-90"
                                            : ""
                                        }`}
                                    variant={plan.variant}
                                    size="lg"
                                >
                                    {plan.cta}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Trust note */}
                <p className="text-center text-sm text-muted-foreground mt-12">
                    Semua paket termasuk garansi uang kembali 14 hari. Tidak ada biaya
                    tersembunyi.
                </p>
            </div>
        </section>
    );
}
