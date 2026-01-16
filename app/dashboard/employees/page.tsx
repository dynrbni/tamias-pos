"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, RefreshCw, Users, Loader2 } from "lucide-react";
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
import { getEmployees, createEmployee, updateEmployee, deleteEmployee, getUserStoreId, type Employee } from "@/lib/api";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPhone, setFormPhone] = useState("");
    const [formRole, setFormRole] = useState("cashier");
    const [formSalary, setFormSalary] = useState("");

    // Stats
    const totalActive = employees.filter(e => e.is_active).length;
    const totalInactive = employees.filter(e => !e.is_active).length;

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (search) {
            setFilteredEmployees(employees.filter(e =>
                e.name.toLowerCase().includes(search.toLowerCase()) ||
                e.email?.toLowerCase().includes(search.toLowerCase()) ||
                e.phone?.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setFilteredEmployees(employees);
        }
    }, [search, employees]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const id = await getUserStoreId();
            if (id) {
                setStoreId(id);
                const data = await getEmployees(id);
                setEmployees(data);
            }
        } catch (err) {
            console.error("Load employees error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingEmployee(null);
        setFormName("");
        setFormEmail("");
        setFormPhone("");
        setFormRole("cashier");
        setFormSalary("");
        setIsModalOpen(true);
    };

    const openEditModal = (emp: Employee) => {
        setEditingEmployee(emp);
        setFormName(emp.name);
        setFormEmail(emp.email || "");
        setFormPhone(emp.phone || "");
        setFormRole(emp.role || "cashier");
        setFormSalary(emp.salary?.toString() || "");
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formName || !storeId) return;

        setIsSaving(true);
        try {
            const empData = {
                store_id: storeId,
                name: formName,
                email: formEmail,
                phone: formPhone,
                role: formRole,
                salary: parseInt(formSalary) || 0,
            };

            if (editingEmployee) {
                await updateEmployee(editingEmployee.id, empData);
            } else {
                await createEmployee(empData);
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
        if (!confirm("Yakin ingin menghapus karyawan ini?")) return;

        try {
            await deleteEmployee(id);
            loadData();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleToggleActive = async (emp: Employee) => {
        try {
            await updateEmployee(emp.id, { is_active: !emp.is_active });
            loadData();
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return <Badge className="bg-purple-100 text-purple-700">Admin</Badge>;
            case 'manager': return <Badge className="bg-blue-100 text-blue-700">Manager</Badge>;
            default: return <Badge variant="outline">Kasir</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
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
                    <h2 className="text-3xl font-bold tracking-tight">Manajemen Karyawan</h2>
                    <p className="text-muted-foreground">Kelola data dan akses karyawan.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={loadData}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={openAddModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Karyawan
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Karyawan</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{employees.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Aktif</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{totalActive}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Nonaktif</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{totalInactive}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari karyawan..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredEmployees.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada karyawan</p>
                            <Button className="mt-4" onClick={openAddModal}>Tambah Karyawan Pertama</Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Karyawan</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Telepon</TableHead>
                                    <TableHead>Bergabung</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-green-100 text-green-700">
                                                        {e.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{e.name}</p>
                                                    <p className="text-xs text-muted-foreground">{e.email || '-'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(e.role)}</TableCell>
                                        <TableCell className="text-muted-foreground">{e.phone || '-'}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {e.joined_at ? new Date(e.joined_at).toLocaleDateString('id-ID') : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={e.is_active ? "default" : "destructive"}
                                                className={e.is_active ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                                            >
                                                {e.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditModal(e)}>
                                                        <Pencil className="mr-2 h-4 w-4" />Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleActive(e)}>
                                                        {e.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(e.id)}>
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
                        <DialogTitle>{editingEmployee ? "Edit Karyawan" : "Tambah Karyawan"}</DialogTitle>
                        <DialogDescription>
                            {editingEmployee ? "Ubah informasi karyawan." : "Masukkan informasi karyawan baru."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Nama Lengkap *</Label>
                            <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ahmad Fauzi" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="ahmad@email.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Telepon</Label>
                            <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="0812-xxxx-xxxx" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Role</Label>
                            <Select value={formRole} onValueChange={setFormRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cashier">Kasir</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Gaji (Rp)</Label>
                            <Input type="number" value={formSalary} onChange={(e) => setFormSalary(e.target.value)} placeholder="3000000" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button onClick={handleSave} disabled={isSaving || !formName} className="bg-green-600 hover:bg-green-700">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingEmployee ? "Simpan" : "Tambah"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
