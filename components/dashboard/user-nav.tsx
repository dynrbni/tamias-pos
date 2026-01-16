"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Bell, User, CreditCard, Settings, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserData {
    name: string;
    email: string;
    initials: string;
    avatarUrl?: string;
}

export function UserNav() {
    const router = useRouter();
    const [user, setUser] = useState<UserData>({
        name: "Memuat...",
        email: "",
        initials: "?"
    });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return;

            // Get profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, avatar_url")
                .eq("id", authUser.id)
                .single();

            const fullName = profile?.full_name || authUser.user_metadata?.full_name || "User";
            const email = authUser.email || "";

            // Generate initials
            const nameParts = fullName.split(" ");
            const initials = nameParts.length >= 2
                ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
                : fullName.substring(0, 2).toUpperCase();

            setUser({
                name: fullName,
                email: email,
                initials: initials,
                avatarUrl: profile?.avatar_url
            });
        } catch (err) {
            console.error("Load user error:", err);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-gray-500">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10 border border-gray-200">
                            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                            <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                                {user.initials}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/billing" className="flex items-center cursor-pointer">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Billing
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
