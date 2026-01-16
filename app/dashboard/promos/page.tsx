"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const promos = [
    { id: "PRM001", name: "Diskon Awal Tahun", type: "Persentase", value: "20%", minPurchase: "Rp 100.000", validUntil: "31 Jan 2026", status: "Aktif" },
    { id: "PRM002", name: "Beli 2 Gratis 1", type: "Bundle", value: "1 Free", minPurchase: "-", validUntil: "28 Feb 2026", status: "Aktif" },
    { id: "PRM003", name: "Cashback QRIS", type: "Cashback", value: "Rp 10.000", minPurchase: "Rp 50.000", validUntil: "15 Jan 2026", status: "Kadaluarsa" },
    { id: "PRM004", name: "Member Special", type: "Persentase", value: "15%", minPurchase: "Rp 200.000", validUntil: "31 Mar 2026", status: "Aktif" },
    { id: "PRM005", name: "Flash Sale Weekend", type: "Potongan", value: "Rp 25.000", minPurchase: "Rp 150.000", validUntil: "20 Jan 2026", status: "Draft" },
];

export default function PromosPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Promo & Diskon</h2>
                    <p className="text-muted-foreground">Kelola promosi dan diskon untuk pelanggan.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Promo Baru
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Promo Aktif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">3</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Penggunaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,245</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Potensi Penghematan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 12.5 Jt</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari promo..." className="pl-9" />
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
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama Promo</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Nilai</TableHead>
                                <TableHead>Min. Belanja</TableHead>
                                <TableHead>Berlaku Hingga</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {promos.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.id}</TableCell>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell>{p.type}</TableCell>
                                    <TableCell className="font-medium text-green-600">{p.value}</TableCell>
                                    <TableCell className="text-muted-foreground">{p.minPurchase}</TableCell>
                                    <TableCell className="text-muted-foreground">{p.validUntil}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === "Aktif" ? "default" : p.status === "Draft" ? "secondary" : "destructive"}
                                            className={p.status === "Aktif" ? "bg-green-100 text-green-700 hover:bg-green-100" : p.status === "Draft" ? "bg-blue-100 text-blue-700" : ""}>
                                            {p.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Copy className="mr-2 h-4 w-4" />Salin Kode</DropdownMenuItem>
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
