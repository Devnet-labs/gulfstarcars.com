'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/actions/auth';
import { LayoutDashboard, Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Analytics } from '@/components/Analytics';

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <>
            <Analytics />
            <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
                </div>

                {/* Background Logo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] opacity-[0.03] pointer-events-none select-none z-0">
                    <img
                        src="/images/portfolio/logo/logo.png"
                        alt=""
                        className="w-full h-auto"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="bg-card/40 backdrop-blur-xl rounded-[32px] border border-white/10 p-8 md:p-10 shadow-2xl">
                        <div className="flex flex-col items-center mb-10 text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-auto h-16 flex items-center justify-center mb-6"
                            >
                                <img
                                    src="/images/portfolio/logo/logo.png"
                                    alt="Gulfstars Logo"
                                    className="h-full w-auto object-contain"
                                />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Gulf Star Automotive</h1>
                            <p className="text-slate-400">Admin Access Dashboard</p>
                        </div>

                        <form action={dispatch} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block px-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20"
                                >
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p className="text-sm font-medium">{errorMessage}</p>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In to Dashboard
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                                Return to Website
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>
        </>
    );
}
