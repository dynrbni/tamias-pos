"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const navLinks = [
    { href: "#features", label: "Fitur" },
    { href: "#how-it-works", label: "Cara Kerja" },
    { href: "#pricing", label: "Harga" },
    { href: "#testimonials", label: "Testimoni" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "glass border-b border-border/50 shadow-sm"
                : "bg-transparent"
                }`}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-foreground">
                            Tamias<span className="text-green-500">POS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Masuk</Link>
                        </Button>
                        <Button size="sm" className="gradient-primary hover:opacity-90 transition-opacity" asChild>
                            <Link href="/register">Mulai Gratis</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col space-y-6 mt-8">
                                <Link href="/" className="flex items-center space-x-2">
                                    <span className="text-xl font-bold text-foreground">
                                        Tamias<span className="text-green-500">POS</span>
                                    </span>
                                </Link>
                                <nav className="flex flex-col space-y-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="flex flex-col space-y-3 pt-4 border-t">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/login">Masuk</Link>
                                    </Button>
                                    <Button className="w-full gradient-primary hover:opacity-90 transition-opacity" asChild>
                                        <Link href="/register">Mulai Gratis</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}
