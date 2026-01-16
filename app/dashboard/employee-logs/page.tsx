"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, LogIn, LogOut, Coffee, ShoppingCart, DollarSign, Settings } from "lucide-react";

const logs = [
    { id: 1, employee: "Ahmad Fauzi", action: "Login", detail: "Masuk ke sistem", time: "08:00", date: "16 Jan 2026", ip: "192.168.1.10" },
    { id: 2, employee: "Ahmad Fauzi", action: "Transaksi", detail: "TRX001 - Rp 125.000", time: "08:15", date: "16 Jan 2026", ip: "192.168.1.10" },
    { id: 3, employee: "Rina Wati", action: "Login", detail: "Masuk ke sistem", time: "08:30", date: "16 Jan 2026", ip: "192.168.1.11" },
    { id: 4, employee: "Ahmad Fauzi", action: "Transaksi", detail: "TRX002 - Rp 78.500", time: "09:45", date: "16 Jan 2026", ip: "192.168.1.10" },
    { id: 5, employee: "Rina Wati", action: "Void", detail: "Membatalkan TRX003", time: "10:20", date: "16 Jan 2026", ip: "192.168.1.11" },
    { id: 6, employee: "Budi Hartono", action: "Login", detail: "Masuk ke sistem", time: "10:30", date: "16 Jan 2026", ip: "192.168.1.12" },
    { id: 7, employee: "Budi Hartono", action: "Settings", detail: "Mengubah pengaturan printer", time: "10:35", date: "16 Jan 2026", ip: "192.168.1.12" },
    { id: 8, employee: "Ahmad Fauzi", action: "Break", detail: "Istirahat makan siang", time: "12:00", date: "16 Jan 2026", ip: "192.168.1.10" },
    { id: 9, employee: "Ahmad Fauzi", action: "Resume", detail: "Kembali dari istirahat", time: "13:00", date: "16 Jan 2026", ip: "192.168.1.10" },
    { id: 10, employee: "Rina Wati", action: "Logout", detail: "Keluar dari sistem", time: "17:00", date: "16 Jan 2026", ip: "192.168.1.11" },
];

const getActionIcon = (action: string) => {
    switch (action) {
        case "Login": return <LogIn className="h-4 w-4 text-green-500" />;
        case "Logout": return <LogOut className="h-4 w-4 text-red-500" />;
        case "Transaksi": return <ShoppingCart className="h-4 w-4 text-blue-500" />;
        case "Void": return <DollarSign className="h-4 w-4 text-red-500" />;
        case "Break": return <Coffee className="h-4 w-4 text-yellow-500" />;
        case "Resume": return <Coffee className="h-4 w-4 text-green-500" />;
        case "Settings": return <Settings className="h-4 w-4 text-gray-500" />;
        default: return null;
    }
};

const getActionBadgeColor = (action: string) => {
    switch (action) {
        case "Login": return "bg-green-100 text-green-700";
        case "Logout": return "bg-red-100 text-red-700";
        case "Transaksi": return "bg-blue-100 text-blue-700";
        case "Void": return "bg-red-100 text-red-700";
        case "Break": return "bg-yellow-100 text-yellow-700";
        case "Resume": return "bg-green-100 text-green-700";
        case "Settings": return "bg-gray-100 text-gray-700";
        default: return "";
    }
};

export default function EmployeeLogsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Log Aktivitas Karyawan</h2>
                    <p className="text-muted-foreground">Pantau semua aktivitas karyawan di sistem.</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Log
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Aktivitas Hari Ini</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Karyawan Online</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">4</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Transaksi Diproses</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <p className="text-sm font-medium text-muted-foreground">Void/Batal</p>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">3</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Cari aktivitas..." className="pl-9" />
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
                                <TableHead>Waktu</TableHead>
                                <TableHead>Karyawan</TableHead>
                                <TableHead>Aksi</TableHead>
                                <TableHead>Detail</TableHead>
                                <TableHead>IP Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{log.time}</p>
                                            <p className="text-xs text-muted-foreground">{log.date}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-7 w-7">
                                                <AvatarFallback className="text-xs bg-green-100 text-green-700">
                                                    {log.employee.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{log.employee}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getActionBadgeColor(log.action)}>
                                            <span className="mr-1">{getActionIcon(log.action)}</span>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{log.detail}</TableCell>
                                    <TableCell className="text-muted-foreground font-mono text-xs">{log.ip}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
