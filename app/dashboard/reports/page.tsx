"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChartGradient } from "@/components/dashboard/area-chart";
import { Overview } from "@/components/dashboard/overview";
import { Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Laporan & Analitik</h2>
                    <p className="text-muted-foreground">Analisis performa bisnis Anda.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" />
                    Export Laporan
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 45.231.000</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +20.1% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transaksi Bulan Ini</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,350</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +15.3% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Produk Terjual</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,234</div>
                        <p className="text-xs text-red-500 flex items-center mt-1">
                            <TrendingDown className="h-3 w-3 mr-1" /> -4.5% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pelanggan Baru</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +201 dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Trend Penjualan</CardTitle>
                        <CardDescription>Grafik penjualan 12 bulan terakhir.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AreaChartGradient />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Perbandingan Bulanan</CardTitle>
                        <CardDescription>Perbandingan pendapatan per bulan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Overview />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
