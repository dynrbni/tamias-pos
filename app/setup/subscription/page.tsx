"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
    {
        id: "starter",
        name: "Starter",
        price: "Gratis",
        description: "Untuk bisnis kecil yang baru mulai.",
        features: ["1 Toko", "50 Produk", "Laporan Harian", "Support Standard"],
    },
    {
        id: "pro",
        name: "Pro",
        price: "Rp 150.000",
        period: "/bulan",
        description: "Untuk bisnis berkembang yang butuh fitur lengkap.",
        features: ["5 Toko", "Unlimited Produk", "Analitik Lengkap", "Support Prioritas", "Export Laporan"],
        popular: true,
    },
];

export default function SubscriptionPage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = () => {
        if (!selectedPlan) return;

        setIsLoading(true);

        // Simulate payment process
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard");
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Pilih Paket</h1>
                <p className="text-sm text-muted-foreground">
                    Pilih paket berlangganan yang sesuai dengan kebutuhan bisnis Anda.
                </p>
            </div>

            <div className="grid gap-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={cn(
                            "relative flex cursor-pointer flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all hover:border-green-600",
                            selectedPlan === plan.id
                                ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                                : "border-gray-200"
                        )}
                        onClick={() => setSelectedPlan(plan.id)}
                    >
                        {plan.popular && (
                            <span className="absolute -top-3 right-4 bg-green-600 px-2 py-0.5 text-xs text-white rounded-full">
                                Terlaris
                            </span>
                        )}
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-lg">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold">{plan.price}</span>
                                    {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                                </div>
                            </div>
                            <div className={cn(
                                "h-6 w-6 rounded-full border-2 flex items-center justify-center",
                                selectedPlan === plan.id ? "border-green-600 bg-green-600" : "border-gray-300"
                            )}>
                                {selectedPlan === plan.id && <Check className="h-4 w-4 text-white" />}
                            </div>
                        </div>

                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {plan.features.map((feature) => (
                                <li key={feature} className="flex items-center">
                                    <Check className="mr-2 h-3 w-3 text-green-600" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <Button
                onClick={handleSubscribe}
                className="w-full bg-green-600 hover:bg-green-700 font-bold py-6 text-lg"
                disabled={isLoading || !selectedPlan}
            >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {selectedPlan ? "Lanjutkan ke Dashboard" : "Pilih Paket Dulu"}
            </Button>
        </div>
    );
}
