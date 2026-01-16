"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Store, Bell, Printer, CreditCard, Shield, Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
                <p className="text-muted-foreground">Kelola preferensi dan konfigurasi toko Anda.</p>
            </div>

            {/* Store Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5" /> Informasi Toko</CardTitle>
                    <CardDescription>Detail dasar tentang toko Anda.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Nama Toko</Label>
                            <Input id="storeName" defaultValue="Tamias Mart" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Input id="phone" defaultValue="0812-3456-7890" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Input id="address" defaultValue="Jl. Merdeka No. 123, Jakarta Selatan" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifikasi</CardTitle>
                    <CardDescription>Atur preferensi notifikasi.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Notifikasi Stok Menipis</p>
                            <p className="text-sm text-muted-foreground">Terima notifikasi saat stok produk menipis.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Notifikasi Transaksi Baru</p>
                            <p className="text-sm text-muted-foreground">Terima notifikasi untuk setiap transaksi baru.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Laporan Harian via Email</p>
                            <p className="text-sm text-muted-foreground">Kirim ringkasan penjualan harian ke email.</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Metode Pembayaran</CardTitle>
                    <CardDescription>Metode pembayaran yang diterima.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Cash</p>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <p className="font-medium">QRIS</p>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Debit/Credit Card</p>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <p className="font-medium">Transfer Bank</p>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                </Button>
            </div>
        </div>
    );
}
