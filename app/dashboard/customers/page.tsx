"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, RefreshCw, Users2, Loader2 } from "lucide-react";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getUserStoreId, formatCurrency, type Customer } from "@/lib/api";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPhone, setFormPhone] = useState("");
    const [formAddress, setFormAddress] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (search) {
            setFilteredCustomers(customers.filter(c =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email?.toLowerCase().includes(search.toLowerCase()) ||
                c.phone?.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setFilteredCustomers(customers);
        }
    }, [search, customers]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const id = await getUserStoreId();
            if (id) {
                setStoreId(id);
                const data = await getCustomers(id);
                setCustomers(data);
            }
        } catch (err) {
            console.error("Load customers error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingCustomer(null);
        setFormName("");
        setFormEmail("");
        setFormPhone("");
        setFormAddress("");
        setIsModalOpen(true);
    };

    const openEditModal = (cust: Customer) => {
        setEditingCustomer(cust);
        setFormName(cust.name);
        setFormEmail(cust.email || "");
        setFormPhone(cust.phone || "");
        setFormAddress(cust.address || "");
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formName || !storeId) return;

        setIsSaving(true);
        try {
            const custData = {
                store_id: storeId,
                name: formName,
                email: formEmail,
                phone: formPhone,
                address: formAddress,
            };

            if (editingCustomer) {
                await updateCustomer(editingCustomer.id, custData);
            } else {
                await createCustomer(custData);
            }

            setIsModalOpen(false);
            loadData();
        } catch (err) {
            console.error("Save error:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus pelanggan ini?")) return;

        try {
            await deleteCustomer(id);
            loadData();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Card><CardContent className="p-6">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full mb-2" />)}
                </CardContent></Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pelanggan</h2>
                    <p className="text-muted-foreground">Daftar semua pelanggan terdaftar. ({customers.length} pelanggan)</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={loadData}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={openAddModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Pelanggan
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari pelanggan..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada pelanggan</p>
                            <Button className="mt-4" onClick={openAddModal}>Tambah Pelanggan Pertama</Button>
                        </div>
                    ) : (
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
                                {filteredCustomers.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-green-100 text-green-700">
                                                        {c.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{c.name}</p>
                                                    <p className="text-xs text-muted-foreground">{c.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{c.phone || '-'}</TableCell>
                                        <TableCell className="text-muted-foreground">{c.email || '-'}</TableCell>
                                        <TableCell className="text-right">{c.total_transactions || 0}x</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(c.total_spent || 0)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditModal(c)}>
                                                        <Pencil className="mr-2 h-4 w-4" />Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(c.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCustomer ? "Edit Pelanggan" : "Tambah Pelanggan"}</DialogTitle>
                        <DialogDescription>
                            {editingCustomer ? "Ubah informasi pelanggan." : "Masukkan informasi pelanggan baru."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Nama *</Label>
                            <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Budi Santoso" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Telepon</Label>
                            <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="0812-xxxx-xxxx" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="budi@email.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Alamat</Label>
                            <Input value={formAddress} onChange={(e) => setFormAddress(e.target.value)} placeholder="Jl. Contoh No. 123" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button onClick={handleSave} disabled={isSaving || !formName} className="bg-green-600 hover:bg-green-700">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingCustomer ? "Simpan" : "Tambah"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
