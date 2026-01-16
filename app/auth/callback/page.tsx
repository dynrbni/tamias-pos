"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the session from URL hash
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("Auth callback error:", error);
                    router.push("/login?error=auth_failed");
                    return;
                }

                if (session?.user) {
                    // Check if user has a store, create one if not
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("store_id")
                        .eq("id", session.user.id)
                        .single();

                    if (!profile?.store_id) {
                        // Create default store for OAuth users
                        const storeName = session.user.user_metadata?.store_name ||
                            `Toko ${session.user.email?.split("@")[0] || "Baru"}`;

                        const { data: store } = await supabase
                            .from("stores")
                            .insert([{ name: storeName, owner_id: session.user.id }])
                            .select()
                            .single();

                        if (store) {
                            await supabase
                                .from("profiles")
                                .upsert([{
                                    id: session.user.id,
                                    full_name: session.user.user_metadata?.full_name || session.user.email,
                                    store_id: store.id,
                                    role: "owner"
                                }]);
                        }
                    }

                    router.push("/dashboard");
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.error("Callback error:", err);
                router.push("/login?error=callback_failed");
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
                <p className="text-muted-foreground">Memproses login...</p>
            </div>
        </div>
    );
}
