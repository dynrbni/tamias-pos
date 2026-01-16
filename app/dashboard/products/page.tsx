"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Loader2, Package, RefreshCw, Camera, Upload, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProducts, createProduct, updateProduct, deleteProduct, getUserStoreId, formatCurrency, type Product } from "@/lib/api";
import { uploadImage, compressImage } from "@/lib/upload";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formName, setFormName] = useState("");
    const [formPrice, setFormPrice] = useState("");
    const [formCost, setFormCost] = useState("");
    const [formCategory, setFormCategory] = useState("");
    const [formStock, setFormStock] = useState("");
    const [formMinStock, setFormMinStock] = useState("10");
    const [formBarcode, setFormBarcode] = useState("");
    const [formImageUrl, setFormImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const barcodeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (search) {
            setFilteredProducts(products.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.barcode?.toLowerCase().includes(search.toLowerCase()) ||
                p.category?.toLowerCase().includes(search.toLowerCase())
            ));
        } else {
            setFilteredProducts(products);
        }
    }, [search, products]);

    // Focus barcode input when modal opens
    useEffect(() => {
        if (isModalOpen && barcodeInputRef.current) {
            // Small delay to ensure modal is fully rendered
            setTimeout(() => barcodeInputRef.current?.focus(), 100);
        }
    }, [isModalOpen]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const id = await getUserStoreId();
            if (id) {
                setStoreId(id);
                const data = await getProducts(id);
                setProducts(data);
            }
        } catch (err) {
            console.error("Load products error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormName("");
        setFormPrice("");
        setFormCost("");
        setFormCategory("");
        setFormStock("");
        setFormMinStock("10");
        setFormBarcode("");
        setFormImageUrl("");
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormName(product.name);
        setFormPrice(product.price.toString());
        setFormCost(product.cost?.toString() || "0");
        setFormCategory(product.category || "");
        setFormStock(product.stock.toString());
        setFormMinStock(product.min_stock?.toString() || "10");
        setFormBarcode(product.barcode || "");
        setFormImageUrl(product.image_url || "");
        setImagePreview(product.image_url || null);
        setIsModalOpen(true);
    };

    const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);

        // Upload
        setIsUploading(true);
        try {
            const compressed = await compressImage(file, 600, 0.8);
            const url = await uploadImage(compressed, 'images', 'products');
            if (url) {
                setFormImageUrl(url);
            }
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setIsUploading(false);
        }
    };

    const clearImage = () => {
        setImagePreview(null);
        setFormImageUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Handle barcode scanner input (scanner typically sends Enter after code)
    const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Move focus to next field
            const nameInput = document.getElementById('product-name');
            nameInput?.focus();
        }
    };

    const handleSave = async () => {
        if (!formName || !formPrice || !storeId) return;

        setIsSaving(true);
        try {
            const productData = {
                store_id: storeId,
                name: formName,
                price: parseInt(formPrice),
                cost: parseInt(formCost) || 0,
                category: formCategory,
                stock: parseInt(formStock) || 0,
                min_stock: parseInt(formMinStock) || 10,
                barcode: formBarcode,
                image_url: formImageUrl,
            };

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await createProduct(productData);
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
        if (!confirm("Yakin ingin menghapus produk ini?")) return;

        try {
            await deleteProduct(id);
            loadData();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const getStatus = (product: Product) => {
        if (product.stock === 0) return { label: "Habis", variant: "destructive" as const };
        if (product.stock <= (product.min_stock || 10)) return { label: "Stok Menipis", variant: "secondary" as const };
        return { label: "Tersedia", variant: "default" as const };
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Card>
                    <CardContent className="p-6">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full mb-2" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Produk</h2>
                    <p className="text-muted-foreground">Kelola semua produk di toko Anda. ({products.length} produk)</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={loadData}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={openAddModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Produk
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari produk atau scan barcode..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada produk</p>
                            <Button className="mt-4" onClick={openAddModal}>Tambah Produk Pertama</Button>
                        </div>
                    ) : (
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
                                {filteredProducts.map((p) => {
                                    const status = getStatus(p);
                                    return (
                                        <TableRow key={p.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 rounded-lg border bg-gray-50">
                                                        {p.image_url ? (
                                                            <img src={p.image_url} alt={p.name} className="h-full w-full object-cover rounded-lg" />
                                                        ) : (
                                                            <AvatarFallback className="rounded-lg bg-green-100 text-green-700">
                                                                {p.name.substring(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{p.name}</span>
                                                        <span className="text-xs text-muted-foreground">{p.barcode || '-'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{p.category || '-'}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(p.price)}</TableCell>
                                            <TableCell className="text-right">{p.stock}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={status.variant}
                                                    className={status.label === "Tersedia" ? "bg-green-100 text-green-700 hover:bg-green-100" : status.label === "Stok Menipis" ? "bg-yellow-100 text-yellow-700" : ""}
                                                >
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditModal(p)}>
                                                            <Pencil className="mr-2 h-4 w-4" />Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(p.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
                        <DialogDescription>
                            {editingProduct ? "Ubah informasi produk." : "Scan barcode atau isi manual."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        {/* Image Upload */}
                        <div className="grid gap-2">
                            <Label>Foto Produk</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={clearImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </>
                                    ) : (
                                        <Camera className="h-6 w-6 text-gray-400" />
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
                                    <p className="text-xs text-muted-foreground mt-1">Max 2MB, JPG/PNG</p>
                                </div>
                            </div>
                        </div>

                        {/* Barcode - Auto-focus for scanner */}
                        <div className="grid gap-2">
                            <Label htmlFor="barcode">Barcode (Scan atau ketik)</Label>
                            <Input
                                id="barcode"
                                ref={barcodeInputRef}
                                value={formBarcode}
                                onChange={(e) => setFormBarcode(e.target.value)}
                                onKeyDown={handleBarcodeKeyDown}
                                placeholder="Scan barcode di sini..."
                                className="font-mono"
                            />
                            <p className="text-xs text-muted-foreground">Arahkan scanner ke field ini untuk scan otomatis</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="product-name">Nama Produk *</Label>
                            <Input id="product-name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Indomie Goreng" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Harga Jual *</Label>
                                <Input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="3500" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Harga Modal</Label>
                                <Input type="number" value={formCost} onChange={(e) => setFormCost(e.target.value)} placeholder="2500" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Kategori</Label>
                            <Input value={formCategory} onChange={(e) => setFormCategory(e.target.value)} placeholder="Makanan" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Stok</Label>
                                <Input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} placeholder="100" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Min. Stok</Label>
                                <Input type="number" value={formMinStock} onChange={(e) => setFormMinStock(e.target.value)} placeholder="10" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button onClick={handleSave} disabled={isSaving || isUploading || !formName || !formPrice} className="bg-green-600 hover:bg-green-700">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingProduct ? "Simpan" : "Tambah"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
