"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2, Mail } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const customers = [
    { id: "CST001", name: "Budi Santoso", phone: "0812-3456-7890", email: "budi@email.com", totalTrx: 45, totalSpent: "Rp 2.350.000" },
    { id: "CST002", name: "Siti Aminah", phone: "0813-2345-6789", email: "siti@email.com", totalTrx: 32, totalSpent: "Rp 1.890.000" },
    { id: "CST003", name: "Andi Wijaya", phone: "0857-8901-2345", email: "andi@email.com", totalTrx: 28, totalSpent: "Rp 1.450.000" },
    { id: "CST004", name: "Dewi Lestari", phone: "0878-9012-3456", email: "dewi@email.com", totalTrx: 19, totalSpent: "Rp 980.000" },
    { id: "CST005", name: "Rizky Pratama", phone: "0821-0123-4567", email: "rizky@email.com", totalTrx: 56, totalSpent: "Rp 3.120.000" },
    { id: "CST006", name: "Maya Sari", phone: "0838-1234-5678", email: "maya@email.com", totalTrx: 12, totalSpent: "Rp 650.000" },
];

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pelanggan</h2>
                    <p className="text-muted-foreground">Daftar semua pelanggan terdaftar.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Pelanggan
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari pelanggan..." className="pl-9" />
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
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Telepon</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Total Transaksi</TableHead>
                                <TableHead className="text-right">Total Belanja</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-green-100 text-green-700">
                                                    {c.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{c.name}</p>
                                                <p className="text-xs text-muted-foreground">{c.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{c.phone}</TableCell>
                                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                                    <TableCell className="text-right">{c.totalTrx}x</TableCell>
                                    <TableCell className="text-right font-medium">{c.totalSpent}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Mail className="mr-2 h-4 w-4" />Kirim Email</DropdownMenuItem>
                                                <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
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
