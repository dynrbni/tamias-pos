"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, Eye, Download, Send } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const invoices = [
    { id: "INV-001", customer: "Budi Santoso", date: "16 Jan 2026", dueDate: "30 Jan 2026", amount: "Rp 1.250.000", status: "Lunas" },
    { id: "INV-002", customer: "Toko Makmur Jaya", date: "15 Jan 2026", dueDate: "29 Jan 2026", amount: "Rp 3.450.000", status: "Pending" },
    { id: "INV-003", customer: "CV Sejahtera", date: "14 Jan 2026", dueDate: "28 Jan 2026", amount: "Rp 2.100.000", status: "Lunas" },
    { id: "INV-004", customer: "Warung Berkah", date: "13 Jan 2026", dueDate: "27 Jan 2026", amount: "Rp 890.000", status: "Jatuh Tempo" },
    { id: "INV-005", customer: "Toko Sinar Abadi", date: "12 Jan 2026", dueDate: "26 Jan 2026", amount: "Rp 1.780.000", status: "Lunas" },
    { id: "INV-006", customer: "PT Maju Bersama", date: "10 Jan 2026", dueDate: "24 Jan 2026", amount: "Rp 5.200.000", status: "Pending" },
];

export default function InvoicesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Faktur</h2>
                    <p className="text-muted-foreground">Kelola semua faktur dan tagihan.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Faktur
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari faktur..." className="pl-9" />
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
                                <TableHead>No. Faktur</TableHead>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Jatuh Tempo</TableHead>
                                <TableHead className="text-right">Jumlah</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-medium">{inv.id}</TableCell>
                                    <TableCell>{inv.customer}</TableCell>
                                    <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                                    <TableCell className="text-muted-foreground">{inv.dueDate}</TableCell>
                                    <TableCell className="text-right font-medium">{inv.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant={inv.status === "Lunas" ? "default" : inv.status === "Pending" ? "secondary" : "destructive"}
                                            className={inv.status === "Lunas" ? "bg-green-100 text-green-700 hover:bg-green-100" : inv.status === "Pending" ? "bg-yellow-100 text-yellow-700" : ""}>
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Lihat Detail</DropdownMenuItem>
                                                <DropdownMenuItem><Download className="mr-2 h-4 w-4" />Download PDF</DropdownMenuItem>
                                                <DropdownMenuItem><Send className="mr-2 h-4 w-4" />Kirim Email</DropdownMenuItem>
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
