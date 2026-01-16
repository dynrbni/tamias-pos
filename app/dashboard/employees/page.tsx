"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, MoreHorizontal, Pencil, Trash2, Key, UserCheck, UserX } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const employees = [
    { id: "EMP001", name: "Ahmad Fauzi", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop", role: "Kasir", phone: "0812-1111-2222", email: "ahmad@tamias.com", joinDate: "01 Jan 2024", status: "Aktif" },
    { id: "EMP002", name: "Rina Wati", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", role: "Kasir Senior", phone: "0813-2222-3333", email: "rina@tamias.com", joinDate: "15 Mar 2023", status: "Aktif" },
    { id: "EMP003", name: "Budi Hartono", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop", role: "Supervisor", phone: "0857-3333-4444", email: "budi@tamias.com", joinDate: "10 Jun 2022", status: "Aktif" },
    { id: "EMP004", name: "Siti Nurhaliza", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop", role: "Kasir", phone: "0878-4444-5555", email: "siti@tamias.com", joinDate: "20 Aug 2024", status: "Cuti" },
    { id: "EMP005", name: "Dedi Mulyadi", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop", role: "Admin", phone: "0821-5555-6666", email: "dedi@tamias.com", joinDate: "05 Feb 2023", status: "Aktif" },
    { id: "EMP006", name: "Lina Sari", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", role: "Kasir", phone: "0838-6666-7777", email: "lina@tamias.com", joinDate: "12 Nov 2024", status: "Nonaktif" },
];

export default function EmployeesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manajemen Karyawan</h2>
                    <p className="text-muted-foreground">Kelola data dan akses karyawan.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Karyawan
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Karyawan</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">6</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Aktif</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">4</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Cuti</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">1</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Nonaktif</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">1</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari karyawan..." className="pl-9" />
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
                                <TableHead>Karyawan</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Telepon</TableHead>
                                <TableHead>Bergabung</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((e) => (
                                <TableRow key={e.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={e.image} alt={e.name} />
                                                <AvatarFallback className="bg-green-100 text-green-700">
                                                    {e.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{e.name}</p>
                                                <p className="text-xs text-muted-foreground">{e.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{e.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{e.phone}</TableCell>
                                    <TableCell className="text-muted-foreground">{e.joinDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={e.status === "Aktif" ? "default" : e.status === "Cuti" ? "secondary" : "destructive"}
                                            className={e.status === "Aktif" ? "bg-green-100 text-green-700 hover:bg-green-100" : e.status === "Cuti" ? "bg-yellow-100 text-yellow-700" : ""}>
                                            {e.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Key className="mr-2 h-4 w-4" />Reset Password</DropdownMenuItem>
                                                <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                <DropdownMenuItem><UserCheck className="mr-2 h-4 w-4" />Aktifkan</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600"><UserX className="mr-2 h-4 w-4" />Nonaktifkan</DropdownMenuItem>
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
