"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SetupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Link href="/" className="mb-8 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                    <span className="text-xl font-bold text-white">T</span>
                </div>
                <span className="text-2xl font-bold">
                    Tamias<span className="text-green-600">POS</span>
                </span>
            </Link>
            {children}
            <p className="mt-8 text-center text-sm text-muted-foreground">
                © 2026 Tamias POS. All rights reserved.
            </p>
        </div>
    );
}
