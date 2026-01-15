import { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { MainNav } from "@/components/dashboard/main-nav";
import { Search } from "@/components/dashboard/search";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Dashboard - Tamias POS",
    description: "Dashboard overview and analytics",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar - Desktop */}
            <div className="hidden border-r bg-white md:block w-72 fixed inset-y-0 z-50">
                <Sidebar className="w-full" />
            </div>

            {/* Main Content */}
            <div className="flex-1 md:pl-72 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-6 h-16 flex items-center justify-between">
                    {/* Mobile Sidebar Trigger */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="-ml-3">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72">
                                <Sidebar />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* In Sidebar layout, TeamSwitcher is inside Sidebar now. Header has Breadcrumb or Search/UserNav */}
                    <div className="flex items-center gap-4 ml-auto">
                        {/* Breadcrumbs could go here if needed later */}
                    </div>

                    <div className="flex items-center space-x-4">
                        <Search />
                        <UserNav />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 space-y-4 p-8 pt-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
