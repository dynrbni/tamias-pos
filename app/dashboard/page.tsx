"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AreaChartGradient } from "@/components/dashboard/area-chart";
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    Plus,
    AlertTriangle,
    TrendingUp,
    Receipt
} from "lucide-react";
import Link from "next/link";

// Dummy Data
const recentTransactions = [
    { id: "TRX001", customer: "Budi Santoso", items: 5, total: "Rp 125.000", time: "2 menit lalu", status: "Sukses" },
    { id: "TRX002", customer: "Siti Aminah", items: 3, total: "Rp 78.500", time: "15 menit lalu", status: "Sukses" },
    { id: "TRX003", customer: "Andi Wijaya", items: 8, total: "Rp 234.000", time: "32 menit lalu", status: "Sukses" },
    { id: "TRX004", customer: "Dewi Lestari", items: 2, total: "Rp 45.000", time: "1 jam lalu", status: "Pending" },
    { id: "TRX005", customer: "Rizky Pratama", items: 6, total: "Rp 156.750", time: "1 jam lalu", status: "Sukses" },
];

const lowStockItems = [
    { name: "Kopi Arabika 250g", stock: 5, threshold: 10 },
    { name: "Gula Pasir 1kg", stock: 8, threshold: 15 },
    { name: "Minyak Goreng 2L", stock: 3, threshold: 10 },
];

const topProducts = [
    { name: "Indomie Goreng", sold: 234, revenue: "Rp 585.000" },
    { name: "Aqua 600ml", sold: 189, revenue: "Rp 472.500" },
    { name: "Rokok Gudang Garam", sold: 156, revenue: "Rp 2.340.000" },
    { name: "Kopi Kapal Api", sold: 145, revenue: "Rp 217.500" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header with Quick Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview penjualan hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                        <Receipt className="mr-2 h-4 w-4" />
                        Download Laporan
                    </Button>
                </div>
            </div>

            {/* Today's Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Penjualan Hari Ini</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 4.525.000</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                            <span className="text-green-600 font-medium">+12.5%</span>&nbsp;dari kemarin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                            <span className="text-green-600 font-medium">+8</span>&nbsp;transaksi dari kemarin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 35.350</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                            <span className="text-red-500 font-medium">-2.1%</span>&nbsp;dari kemarin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Produk Terjual</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">847</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                            <span className="text-green-600 font-medium">+56</span>&nbsp;item dari kemarin
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 lg:grid-cols-7">
                {/* Sales Chart */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Grafik Penjualan</CardTitle>
                        <CardDescription>Trend penjualan 7 hari terakhir.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <AreaChartGradient />
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                Stok Menipis
                            </CardTitle>
                            <CardDescription>Produk yang perlu segera restock.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/products">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {lowStockItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <div>
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Min. stok: {item.threshold}</p>
                                    </div>
                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                        {item.stock} tersisa
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions & Top Products */}
            <div className="grid gap-4 lg:grid-cols-7">
                {/* Recent Transactions Table */}
                <Card className="lg:col-span-4">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Transaksi Terakhir</CardTitle>
                            <CardDescription>5 transaksi terbaru hari ini.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/transactions">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTransactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="font-medium">{tx.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-7 w-7">
                                                    <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                                        {tx.customer.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{tx.customer}</p>
                                                    <p className="text-xs text-muted-foreground">{tx.items} item • {tx.time}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{tx.total}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={tx.status === "Sukses" ? "default" : "secondary"} className={tx.status === "Sukses" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                                                {tx.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Top Selling Products */}
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                Produk Terlaris
                            </CardTitle>
                            <CardDescription>Produk paling laku minggu ini.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.map((product, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-sm">
                                        #{i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.sold} terjual</p>
                                    </div>
                                    <div className="text-sm font-medium text-right">
                                        {product.revenue}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
