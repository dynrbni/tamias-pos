"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Settings,
    BarChart3,
    LogOut,
    FileText,
    LifeBuoy,
    Send
} from "lucide-react";
import TeamSwitcher from "@/components/dashboard/team-switcher";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn("pb-12 bg-white border-r h-full flex flex-col", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mb-6 px-2">
                        <TeamSwitcher />
                    </div>

                    <div className="px-3 mb-2">
                        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
                            Home
                        </h2>
                        <div className="space-y-1">
                            <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} className="w-full justify-start" asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" asChild>
                                <Link href="/dashboard/transactions">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Transaksi
                                </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" asChild>
                                <Link href="/dashboard/products">
                                    <Package className="mr-2 h-4 w-4" />
                                    Produk
                                </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" asChild>
                                <Link href="/dashboard/customers">
                                    <Users className="mr-2 h-4 w-4" />
                                    Pelanggan
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="px-3 mb-2 mt-4">
                        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
                            Laporan
                        </h2>
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start" asChild>
                                <Link href="/dashboard/reports">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Analitik
                                </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" asChild>
                                <Link href="/dashboard/invoices">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Faktur
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="px-3 mb-2 mt-4">
                        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
                            Bantuan
                        </h2>
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start">
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                Pusat Bantuan
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Send className="mr-2 h-4 w-4" />
                                Feedback
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-auto p-4 border-t">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" asChild>
                    <Link href="/">
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                    </Link>
                </Button>
            </div>
        </div>
    );
}
