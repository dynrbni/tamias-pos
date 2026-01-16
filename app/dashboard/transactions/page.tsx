"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, Eye, Printer } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const transactions = [
    { id: "TRX001", customer: "Budi Santoso", items: 5, total: "Rp 125.000", date: "16 Jan 2026, 10:30", method: "Cash", status: "Sukses" },
    { id: "TRX002", customer: "Siti Aminah", items: 3, total: "Rp 78.500", date: "16 Jan 2026, 09:45", method: "QRIS", status: "Sukses" },
    { id: "TRX003", customer: "Andi Wijaya", items: 8, total: "Rp 234.000", date: "16 Jan 2026, 09:12", method: "Debit", status: "Sukses" },
    { id: "TRX004", customer: "Dewi Lestari", items: 2, total: "Rp 45.000", date: "16 Jan 2026, 08:55", method: "Cash", status: "Pending" },
    { id: "TRX005", customer: "Rizky Pratama", items: 6, total: "Rp 156.750", date: "15 Jan 2026, 18:20", method: "QRIS", status: "Sukses" },
    { id: "TRX006", customer: "Maya Sari", items: 4, total: "Rp 93.200", date: "15 Jan 2026, 17:10", method: "Cash", status: "Sukses" },
    { id: "TRX007", customer: "Agus Hidayat", items: 10, total: "Rp 312.500", date: "15 Jan 2026, 16:30", method: "Transfer", status: "Sukses" },
    { id: "TRX008", customer: "Linda Permata", items: 1, total: "Rp 25.000", date: "15 Jan 2026, 15:45", method: "Cash", status: "Batal" },
];

export default function TransactionsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transaksi</h2>
                    <p className="text-muted-foreground">Riwayat semua transaksi penjualan.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Transaksi Baru
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari transaksi..." className="pl-9" />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID Transaksi</TableHead>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Metode</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-medium">{tx.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-7 w-7">
                                                <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                                    {tx.customer.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{tx.customer}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                                    <TableCell>{tx.method}</TableCell>
                                    <TableCell className="text-right font-medium">{tx.total}</TableCell>
                                    <TableCell>
                                        <Badge variant={tx.status === "Sukses" ? "default" : tx.status === "Pending" ? "secondary" : "destructive"}
                                            className={tx.status === "Sukses" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                                            {tx.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Lihat Detail</DropdownMenuItem>
                                                <DropdownMenuItem><Printer className="mr-2 h-4 w-4" />Cetak Struk</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
