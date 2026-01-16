"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const products = [
    { id: "PRD001", name: "Indomie Goreng", image: "https://images.unsplash.com/photo-1613243555988-441166d4d6fd?w=100&h=100&fit=crop", category: "Makanan", price: "Rp 3.500", stock: 150, status: "Tersedia" },
    { id: "PRD002", name: "Aqua 600ml", image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=100&h=100&fit=crop", category: "Minuman", price: "Rp 4.000", stock: 200, status: "Tersedia" },
    { id: "PRD003", name: "Kopi Kapal Api", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop", category: "Minuman", price: "Rp 2.500", stock: 80, status: "Tersedia" },
    { id: "PRD004", name: "Gula Pasir 1kg", image: "https://images.unsplash.com/photo-1581441363689-1f3c8c414635?w=100&h=100&fit=crop", category: "Bahan Pokok", price: "Rp 15.000", stock: 8, status: "Stok Menipis" },
    { id: "PRD005", name: "Minyak Goreng 2L", image: "https://images.unsplash.com/photo-1474631245212-32dc3c8e2c81?w=100&h=100&fit=crop", category: "Bahan Pokok", price: "Rp 32.000", stock: 3, status: "Stok Menipis" },
    { id: "PRD006", name: "Teh Pucuk Harum", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&h=100&fit=crop", category: "Minuman", price: "Rp 4.500", stock: 120, status: "Tersedia" },
    { id: "PRD007", name: "Sabun Lifebuoy", image: "https://images.unsplash.com/photo-1600857062241-98e5dba9959e?w=100&h=100&fit=crop", category: "Perawatan", price: "Rp 5.000", stock: 0, status: "Habis" },
];

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Produk</h2>
                    <p className="text-muted-foreground">Kelola semua produk di toko Anda.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Produk
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari produk..." className="pl-9" />
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
                                <TableHead>Produk</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead className="text-right">Harga</TableHead>
                                <TableHead className="text-right">Stok</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 rounded-lg border bg-gray-50">
                                                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                                                <AvatarFallback className="rounded-lg">IMG</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{p.name}</span>
                                                <span className="text-xs text-muted-foreground">{p.id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{p.category}</TableCell>
                                    <TableCell className="text-right">{p.price}</TableCell>
                                    <TableCell className="text-right">{p.stock}</TableCell>
                                    <TableCell>
                                        <Badge variant={p.status === "Tersedia" ? "default" : p.status === "Stok Menipis" ? "secondary" : "destructive"}
                                            className={p.status === "Tersedia" ? "bg-green-100 text-green-700 hover:bg-green-100" : p.status === "Stok Menipis" ? "bg-yellow-100 text-yellow-700" : ""}>
                                            {p.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
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
