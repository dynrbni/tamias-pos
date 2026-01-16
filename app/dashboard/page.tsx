"use client";

import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    ShoppingCart,
    Package,
    Receipt,
    AlertTriangle,
    TrendingUp,
    Loader2,
    RefreshCw
} from "lucide-react";
import Link from "next/link";
import {
    getDashboardStats,
    getChartData,
    getTopProducts,
    getLowStockProducts,
    getRecentTransactions,
    getUserStoreId,
    formatCurrency,
    formatRelativeTime,
    type DashboardStats,
    type ChartDataPoint,
    type TopProduct,
    type LowStockProduct,
    type RecentTransaction
} from "@/lib/api";

// Chart component with dynamic data
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function SalesChart({ data, isLoading }: { data: ChartDataPoint[], isLoading: boolean }) {
    if (isLoading) {
        return <Skeleton className="h-[300px] w-full" />;
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Belum ada data penjualan
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="day_name"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
                />
                <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Penjualan']}
                    labelFormatter={(label) => `Hari: ${label}`}
                />
                <Area
                    type="monotone"
                    dataKey="total_sales"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default function DashboardPage() {
    const [storeId, setStoreId] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
    const [recentTx, setRecentTx] = useState<RecentTransaction[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load store ID and data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get store ID
            const id = await getUserStoreId();
            if (!id) {
                setError("Tidak ada toko terkait. Silakan buat toko terlebih dahulu.");
                setIsLoading(false);
                return;
            }
            setStoreId(id);

            // Fetch all data in parallel
            const [statsData, chartDataRes, topProductsRes, lowStockRes, recentTxRes] = await Promise.all([
                getDashboardStats(id).catch(() => null),
                getChartData(id).catch(() => []),
                getTopProducts(id).catch(() => []),
                getLowStockProducts(id).catch(() => []),
                getRecentTransactions(id).catch(() => [])
            ]);

            setStats(statsData);
            setChartData(chartDataRes || []);
            setTopProducts(topProductsRes || []);
            setLowStock(lowStockRes || []);
            setRecentTx(recentTxRes || []);

        } catch (err: any) {
            console.error("Dashboard load error:", err);
            setError(err.message || "Gagal memuat data dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-32" />
                                <Skeleton className="h-3 w-20 mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
                <p className="text-lg text-muted-foreground">{error}</p>
                <Button onClick={loadData}>Coba Lagi</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Quick Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Overview penjualan hari ini, {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
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
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats?.today_sales || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            {(stats?.sales_change_percent || 0) >= 0 ? (
                                <>
                                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                                    <span className="text-green-600 font-medium">
                                        +{stats?.sales_change_percent || 0}%
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                                    <span className="text-red-500 font-medium">
                                        {stats?.sales_change_percent || 0}%
                                    </span>
                                </>
                            )}
                            &nbsp;dari kemarin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.today_transactions || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            {(stats?.transactions_change || 0) >= 0 ? (
                                <>
                                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                                    <span className="text-green-600 font-medium">
                                        +{stats?.transactions_change || 0}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                                    <span className="text-red-500 font-medium">
                                        {stats?.transactions_change || 0}
                                    </span>
                                </>
                            )}
                            &nbsp;transaksi dari kemarin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats?.average_transaction || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            {(stats?.average_change_percent || 0) >= 0 ? (
                                <>
                                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                                    <span className="text-green-600 font-medium">
                                        +{stats?.average_change_percent || 0}%
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                                    <span className="text-red-500 font-medium">
                                        {stats?.average_change_percent || 0}%
                                    </span>
                                </>
                            )}
                            &nbsp;dari kemarin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Produk Terjual</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.today_items_sold || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            {(stats?.items_change || 0) >= 0 ? (
                                <>
                                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                                    <span className="text-green-600 font-medium">
                                        +{stats?.items_change || 0}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                                    <span className="text-red-500 font-medium">
                                        {stats?.items_change || 0}
                                    </span>
                                </>
                            )}
                            &nbsp;item dari kemarin
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
                        <SalesChart data={chartData} isLoading={isRefreshing} />
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                Stok Menipis
                                {lowStock.length > 0 && (
                                    <Badge variant="secondary" className="ml-2">
                                        {lowStock.length}
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>Produk yang perlu segera restock.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/dashboard/products">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {lowStock.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Tidak ada produk dengan stok menipis
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {lowStock.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <div>
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Min. stok: {item.min_stock}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                            {item.stock} tersisa
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
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
                        {recentTx.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Belum ada transaksi hari ini
                            </div>
                        ) : (
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
                                    {recentTx.map((tx) => (
                                        <TableRow key={tx.full_id}>
                                            <TableCell className="font-medium">{tx.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-7 w-7">
                                                        <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                                            {tx.customer.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{tx.customer}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {tx.items_count} item • {formatRelativeTime(tx.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(tx.total)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={tx.status === "completed" ? "default" : "secondary"}
                                                    className={tx.status === "completed" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                                                >
                                                    {tx.status === "completed" ? "Sukses" : tx.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
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
                        {topProducts.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Belum ada data penjualan produk
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {topProducts.map((product, i) => (
                                    <div key={product.id} className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold text-sm">
                                            #{i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{product.name}</p>
                                            <p className="text-xs text-muted-foreground">{product.sold} terjual</p>
                                        </div>
                                        <div className="text-sm font-medium text-right">
                                            {formatCurrency(product.revenue)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
