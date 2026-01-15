"use client";

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
import { Bell } from "lucide-react";

export function UserNav() {
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
                            <AvatarImage src="/avatars/01.png" alt="@user" />
                            <AvatarFallback className="bg-green-100 text-green-700 font-bold">DR</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Dean Rabbani</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                dean@tamias.com
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Billing
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Settings
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/">Log out</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
