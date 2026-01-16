"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MoreHorizontal, Eye, RefreshCw, Receipt, XCircle, RotateCcw } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getTransactions, getUserStoreId, formatCurrency, formatRelativeTime, type Transaction } from "@/lib/api";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTx, setFilteredTx] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Detail modal
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (search) {
            setFilteredTx(transactions.filter(tx =>
                tx.id.toLowerCase().includes(search.toLowerCase()) ||
                (tx as any).customers?.name?.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setFilteredTx(transactions);
        }
    }, [search, transactions]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const id = await getUserStoreId();
            if (id) {
                setStoreId(id);
                const data = await getTransactions(id);
                setTransactions(data);
            }
        } catch (err) {
            console.error("Load transactions error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const openDetail = (tx: Transaction) => {
        setSelectedTx(tx);
        setIsDetailOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Sukses</Badge>;
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Batal</Badge>;
            case 'refunded':
                return <Badge className="bg-orange-100 text-orange-700">Refund</Badge>;
            default:
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Sukses</Badge>;
        }
    };

    const getPaymentMethod = (method: string) => {
        switch (method) {
            case 'cash': return 'Cash';
            case 'card': return 'Kartu';
            case 'qris': return 'QRIS';
            case 'transfer': return 'Transfer';
            default: return method || 'Cash';
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Card>
                    <CardContent className="p-6">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full mb-2" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transaksi</h2>
                    <p className="text-muted-foreground">Riwayat semua transaksi penjualan. ({transactions.length} transaksi)</p>
                </div>
                <Button variant="outline" onClick={loadData}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari transaksi..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredTx.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada transaksi</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Transaksi</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Waktu</TableHead>
                                    <TableHead>Metode</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTx.map((tx) => {
                                    const customer = (tx as any).customers?.name || 'Walk-in';
                                    const itemsCount = Array.isArray(tx.items) ? tx.items.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0) : 0;

                                    return (
                                        <TableRow key={tx.id}>
                                            <TableCell className="font-medium font-mono">
                                                {tx.id.substring(0, 8).toUpperCase()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-7 w-7">
                                                        <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                                            {customer.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm">{customer}</p>
                                                        <p className="text-xs text-muted-foreground">{itemsCount} item</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {formatRelativeTime(tx.created_at)}
                                            </TableCell>
                                            <TableCell>{getPaymentMethod(tx.payment_method)}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(tx.total)}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(tx.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openDetail(tx)}>
                                                            <Eye className="mr-2 h-4 w-4" />Lihat Detail
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Detail Transaksi</DialogTitle>
                        <DialogDescription>
                            ID: {selectedTx?.id.substring(0, 8).toUpperCase()}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTx && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Pelanggan</p>
                                    <p className="font-medium">{(selectedTx as any).customers?.name || 'Walk-in'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Waktu</p>
                                    <p className="font-medium">{new Date(selectedTx.created_at).toLocaleString('id-ID')}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Metode Bayar</p>
                                    <p className="font-medium">{getPaymentMethod(selectedTx.payment_method)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Status</p>
                                    {getStatusBadge(selectedTx.status)}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="font-medium mb-2">Items</p>
                                <div className="space-y-2">
                                    {Array.isArray(selectedTx.items) && selectedTx.items.map((item: any, i: number) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span>{item.name || item.product_name} x{item.quantity || item.qty || 1}</span>
                                            <span>{formatCurrency((item.price || 0) * (item.quantity || item.qty || 1))}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(selectedTx.subtotal)}</span>
                                </div>
                                {selectedTx.tax > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span>Pajak</span>
                                        <span>{formatCurrency(selectedTx.tax)}</span>
                                    </div>
                                )}
                                {selectedTx.discount > 0 && (
                                    <div className="flex justify-between text-sm text-red-600">
                                        <span>Diskon</span>
                                        <span>-{formatCurrency(selectedTx.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span>{formatCurrency(selectedTx.total)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
