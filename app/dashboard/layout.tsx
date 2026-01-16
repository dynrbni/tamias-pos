"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { Search } from "@/components/dashboard/search";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (!isMounted.current) return;

                if (error || !session) {
                    router.replace("/login");
                    return;
                }

                setIsAuthenticated(true);
            } catch (err: any) {
                // Ignore abort errors
                if (err.name === 'AbortError') return;
                if (!isMounted.current) return;

                console.error("Auth check error:", err);
                router.replace("/login");
            } finally {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            }
        };

        checkAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted.current) return;

            if (event === "SIGNED_OUT" || !session) {
                router.replace("/login");
            }
        });

        return () => {
            isMounted.current = false;
            subscription.unsubscribe();
        };
    }, [router]);

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
                    <p className="text-muted-foreground">Memuat...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar - Desktop */}
            <div className="hidden border-r bg-white md:block w-72 fixed inset-y-0 z-50">
                <Sidebar className="w-full" />
            </div>

            {/* Main Content */}
            <div className="flex-1 md:pl-72 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-6 h-16 flex items-center justify-between">
                    {/* Mobile Sidebar Trigger */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="-ml-3">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72">
                                <Sidebar />
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        {/* Breadcrumbs could go here if needed later */}
                    </div>

                    <div className="flex items-center space-x-4">
                        <Search />
                        <UserNav />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 space-y-4 p-8 pt-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
