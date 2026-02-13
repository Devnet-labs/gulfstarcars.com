import Link from 'next/link';
import { LayoutDashboard, MessageSquare, Car, LogOut, ArrowLeft, BarChart3, Users } from 'lucide-react';
import { signOut } from '@/auth';
import { Roboto } from "next/font/google"; // Import font
import "../globals.css"; // Import globals

const roboto = Roboto({
    subsets: ["latin"],
    variable: "--font-roboto",
    weight: ["400", "500", "700"],
});
import { Toaster } from 'sonner';

export const dynamic = 'force-dynamic';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Current path check would be ideal for active state, but keeping it simple for server component layout
    return (
        <html lang="en">
            <body className={`${roboto.variable} font-sans antialiased bg-[#0B0F19] text-white`}>
                <div className="flex min-h-screen bg-[#0B0F19] text-slate-200">
                    {/* Sidebar */}
                    <aside className="hidden w-64 border-r border-white/5 bg-card/20 backdrop-blur-xl md:flex flex-col fixed inset-y-0 z-50">
                        <div className="flex h-40 items-center px-4 border-b border-white/5 overflow-hidden">
                            <Link href="/admin" className="flex flex-col items-center justify-center w-full gap-3 font-bold text-white tracking-tight cursor-pointer group">
                                <div className="w-48 h-24 overflow-hidden flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                    <img
                                        src="/images/portfolio/logo/logo.png"
                                        alt="Gulfstars Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary transition-colors">Admin Dashboard</span>
                            </Link>
                        </div>
                        <nav className="flex flex-col gap-2 p-4 flex-1">
                            <div className="px-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Overview
                            </div>
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition-all hover:text-white hover:bg-white/5 group cursor-pointer"
                            >
                                <LayoutDashboard className="h-5 w-5 group-hover:text-primary transition-colors" />
                                <span className="font-medium">Dashboard</span>
                            </Link>
                            <Link
                                href="/admin/analytics"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition-all hover:text-white hover:bg-white/5 group cursor-pointer"
                            >
                                <BarChart3 className="h-5 w-5 group-hover:text-emerald-500 transition-colors" />
                                <span className="font-medium">Analytics</span>
                            </Link>

                            <div className="px-2 mt-6 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Management
                            </div>
                            <Link
                                href="/admin/enquiries"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition-all hover:text-white hover:bg-white/5 group cursor-pointer"
                            >
                                <MessageSquare className="h-5 w-5 group-hover:text-amber-500 transition-colors" />
                                <span className="font-medium">Enquiries</span>
                            </Link>
                            <Link
                                href="/admin/cars"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition-all hover:text-white hover:bg-white/5 group cursor-pointer"
                            >
                                <Car className="h-5 w-5 group-hover:text-blue-500 transition-colors" />
                                <span className="font-medium">Manage Cars</span>
                            </Link>
                            <Link
                                href="/admin/team"
                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition-all hover:text-white hover:bg-white/5 group cursor-pointer"
                            >
                                <Users className="h-5 w-5 group-hover:text-purple-500 transition-colors" />
                                <span className="font-medium">Team Management</span>
                            </Link>
                        </nav>
                        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
                            <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all mb-2 cursor-pointer">
                                <ArrowLeft className="h-5 w-5" />
                                <span className="font-medium">Website Home</span>
                            </Link>
                            <form
                                action={async () => {
                                    'use server';
                                    await signOut({ redirectTo: '/' });
                                }}
                            >
                                <button className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer">
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            </form>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 md:pl-64 min-h-screen">
                        <div className="p-4 md:p-8 max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}
