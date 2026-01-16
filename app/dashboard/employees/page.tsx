"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, RefreshCw, Users, Loader2, Camera, Upload, X, Key, Copy, Eye, EyeOff } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import { uploadImage, compressImage } from "@/lib/upload";

// Generate random 10-digit employee ID
function generateEmployeeId(): string {
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

// Generate random password
function generatePassword(length = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

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

    // Password modal
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Form state
    const [formName, setFormName] = useState("");
    const [formEmployeeId, setFormEmployeeId] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formPhone, setFormPhone] = useState("");
    const [formRole, setFormRole] = useState("cashier");
    const [formSalary, setFormSalary] = useState("");
    const [formAvatarUrl, setFormAvatarUrl] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [showFormPassword, setShowFormPassword] = useState(false);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                e.employee_id?.includes(search) ||
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
        setFormEmployeeId(generateEmployeeId());
        setFormPassword(generatePassword());
        setFormPhone("");
        setFormRole("cashier");
        setFormSalary("");
        setFormAvatarUrl("");
        setImagePreview(null);
        setUploadError("");
        setShowFormPassword(true);
        setIsModalOpen(true);
    };

    const openEditModal = (emp: Employee) => {
        setEditingEmployee(emp);
        setFormName(emp.name);
        setFormEmployeeId(emp.employee_id || "");
        setFormPassword(""); // Don't show existing password
        setFormPhone(emp.phone || "");
        setFormRole(emp.role || "cashier");
        setFormSalary(emp.salary?.toString() || "");
        setFormAvatarUrl((emp as any).avatar_url || "");
        setImagePreview((emp as any).avatar_url || null);
        setUploadError("");
        setShowFormPassword(false);
        setIsModalOpen(true);
    };

    const openPasswordModal = (emp: Employee) => {
        setSelectedEmployee(emp);
        setNewPassword(generatePassword());
        setShowPassword(true);
        setIsPasswordModalOpen(true);
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError("");

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setIsUploading(true);
        try {
            const compressed = await compressImage(file, 400, 0.8);
            const url = await uploadImage(compressed, 'images', 'employees');
            if (url) {
                setFormAvatarUrl(url);
            } else {
                setUploadError("Upload gagal. Simpan tanpa foto atau coba lagi.");
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            setUploadError(err.message || "Upload gagal.");
        } finally {
            setIsUploading(false);
        }
    };

    const clearImage = () => {
        setImagePreview(null);
        setFormAvatarUrl("");
        setUploadError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleSave = async () => {
        if (!formName || !storeId) return;

        // New employee must have password
        if (!editingEmployee && !formPassword) {
            alert("Password wajib diisi untuk karyawan baru");
            return;
        }

        setIsSaving(true);
        try {
            const empData: any = {
                store_id: storeId,
                name: formName,
                employee_id: formEmployeeId,
                phone: formPhone,
                role: formRole,
                salary: parseInt(formSalary) || 0,
                avatar_url: formAvatarUrl,
            };

            // Only include password if set
            if (formPassword) {
                empData.pin = formPassword;
            }

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

    const handleChangePassword = async () => {
        if (!selectedEmployee || !newPassword) return;

        setIsChangingPassword(true);
        try {
            await updateEmployee(selectedEmployee.id, { pin: newPassword });
            setIsPasswordModalOpen(false);
            alert(`Password berhasil diubah!\n\nID: ${selectedEmployee.employee_id}\nPassword Baru: ${newPassword}`);
        } catch (err) {
            console.error("Change password error:", err);
            alert("Gagal mengubah password");
        } finally {
            setIsChangingPassword(false);
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

            {/* Search & List */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama, ID, atau telepon..."
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
                            <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={openAddModal}>
                                Tambah Karyawan Pertama
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Karyawan</TableHead>
                                    <TableHead>ID Login</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Telepon</TableHead>
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
                                                    <AvatarImage src={(e as any).avatar_url} />
                                                    <AvatarFallback className="bg-green-100 text-green-700">
                                                        {e.name?.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{e.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                                                {e.employee_id || '-'}
                                            </code>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(e.role)}</TableCell>
                                        <TableCell>{e.phone || '-'}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={e.is_active ? "default" : "secondary"}
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
                                                    <DropdownMenuItem onClick={() => openPasswordModal(e)}>
                                                        <Key className="mr-2 h-4 w-4" />Ganti Password
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleActive(e)}>
                                                        {e.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
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
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingEmployee ? "Edit Karyawan" : "Tambah Karyawan"}</DialogTitle>
                        <DialogDescription>
                            {editingEmployee ? "Ubah informasi karyawan." : "Buat akun karyawan baru untuk login aplikasi kasir."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        {/* Photo Upload */}
                        <div className="grid gap-2">
                            <Label>Foto Karyawan</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 border-2 border-dashed rounded-full flex items-center justify-center bg-gray-50 overflow-hidden">
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={clearImage}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <Camera className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</>
                                        ) : (
                                            <><Upload className="mr-2 h-4 w-4" />Upload Foto</>
                                        )}
                                    </Button>
                                    {uploadError && (
                                        <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Nama Lengkap *</Label>
                            <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ahmad Fauzi" />
                        </div>

                        {/* Employee ID */}
                        <div className="grid gap-2">
                            <Label>ID Karyawan (untuk login)</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={formEmployeeId}
                                    onChange={(e) => setFormEmployeeId(e.target.value)}
                                    placeholder="1234567890"
                                    className="font-mono"
                                    readOnly={!!editingEmployee}
                                />
                                {!editingEmployee && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setFormEmployeeId(generateEmployeeId())}
                                        title="Generate ID Baru"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(formEmployeeId)}
                                    title="Copy ID"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">ID 10 digit untuk login di aplikasi kasir</p>
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label>{editingEmployee ? "Password Baru (kosongkan jika tidak diubah)" : "Password *"}</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type={showFormPassword ? "text" : "password"}
                                        value={formPassword}
                                        onChange={(e) => setFormPassword(e.target.value)}
                                        placeholder={editingEmployee ? "Kosongkan jika tidak diubah" : "Password"}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowFormPassword(!showFormPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showFormPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setFormPassword(generatePassword())}
                                    title="Generate Password"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(formPassword)}
                                    title="Copy Password"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
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
                        <Button onClick={handleSave} disabled={isSaving || isUploading || !formName} className="bg-green-600 hover:bg-green-700">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingEmployee ? "Simpan" : "Tambah"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Password Modal */}
            <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Ganti Password</DialogTitle>
                        <DialogDescription>
                            Ubah password untuk {selectedEmployee?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-muted-foreground">ID Karyawan</p>
                            <code className="text-lg font-mono font-bold">{selectedEmployee?.employee_id}</code>
                        </div>
                        <div className="grid gap-2">
                            <Label>Password Baru</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pr-10 font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setNewPassword(generatePassword())}
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(newPassword)}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>Batal</Button>
                        <Button onClick={handleChangePassword} disabled={isChangingPassword || !newPassword} className="bg-green-600 hover:bg-green-700">
                            {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
