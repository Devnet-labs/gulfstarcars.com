import { prisma } from '@/lib/db';
import { MessageSquare, Car, DollarSign, Activity, ArrowUpRight, Clock, CheckCircle, TrendingUp, Filter, Users, Globe } from 'lucide-react';
import * as Motion from '@/components/motion';
import Link from 'next/link';
import { FormattedDate } from '@/components/FormattedDate';

export const dynamic = 'force-dynamic';

async function getDashboardStats() {
    try {
        const [
            totalCars,
            totalEnquiries,
            pendingEnquiries,
            repliedEnquiries,
            recentCars,
            recentEnquiries,
            totalVisits,
            topCountriesRaw,
            topPagesRaw,
            deviceStatsRaw,
            browserStatsRaw,
            recentVisits
        ] = await Promise.all([
            prisma.car.count(),
            prisma.enquiry.count(),
            prisma.enquiry.count({ where: { status: 'PENDING' } }),
            prisma.enquiry.count({ where: { status: 'REPLIED' } }),
            prisma.car.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, make: true, model: true, price: true, images: true, status: true, condition: true, createdAt: true }
            }),
            prisma.enquiry.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, userName: true, userEmail: true, message: true, status: true, car: { select: { make: true, model: true } }, createdAt: true }
            }),
            prisma.visit.count(),
            prisma.visit.groupBy({
                by: ['country'],
                _count: { country: true },
                orderBy: { _count: { country: 'desc' } },
                take: 6,
            }),
            prisma.visit.groupBy({
                by: ['path'],
                _count: { path: true },
                orderBy: { _count: { path: 'desc' } },
                take: 8,
            }),
            prisma.visit.groupBy({
                by: ['device'],
                _count: { device: true },
                orderBy: { _count: { device: 'desc' } },
            }),
            prisma.visit.groupBy({
                by: ['browser'],
                _count: { browser: true },
                orderBy: { _count: { browser: 'desc' } },
                take: 5,
            }),
            prisma.visit.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
            })
        ]);

        const allCars = await prisma.car.findMany({ select: { price: true } });
        const totalValue = allCars.reduce((sum, car) => sum + (car.price || 0), 0);

        return {
            totalCars,
            totalEnquiries,
            pendingEnquiries,
            repliedEnquiries,
            recentCars,
            recentEnquiries,
            totalValue,
            totalVisits,
            topCountries: topCountriesRaw.map(i => ({ country: i.country, count: i._count.country })),
            topPages: topPagesRaw.map(i => ({ path: i.path || '/', count: i._count.path })),
            deviceStats: deviceStatsRaw.map(i => ({ type: i.device || 'Desktop', count: i._count.device })),
            browserStats: browserStatsRaw.map(i => ({ name: i.browser || 'Other', count: i._count.browser })),
            recentVisits
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return null;
    }
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats();

    if (!stats) {
        return (
            <div className="p-8 text-center text-red-400">
                Failed to load dashboard data. Please try again later.
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-400 mt-1">Real-time insights into your business performance.</p>
                </div>
                <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 text-sm text-slate-300">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Last updated: <FormattedDate date={new Date()} showTime /></span>
                </div>
            </div>

            {/* Primary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Inventory */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-card/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Car className="w-24 h-24 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Car className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-slate-400 font-medium">Total Inventory</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stats.totalCars}</div>
                        <div className="text-sm text-blue-400 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>Vehicles in stock</span>
                        </div>
                    </div>
                </Motion.div>

                {/* Total Value */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-card/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-slate-400 font-medium">Inventory Value</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{formatCurrency(stats.totalValue)}</div>
                        <div className="text-sm text-emerald-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Estimated Asset Value</span>
                        </div>
                    </div>
                </Motion.div>

                {/* Total Visits */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-card/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-pink-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-pink-400" />
                            </div>
                            <span className="text-slate-400 font-medium">Total Visitors</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stats.totalVisits}</div>
                        <div className="text-sm text-pink-400 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>Site Traffic</span>
                        </div>
                    </div>
                </Motion.div>

                {/* Total Enquiries */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-card/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="w-24 h-24 text-purple-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-purple-400" />
                            </div>
                            <span className="text-slate-400 font-medium">Total Enquiries</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stats.totalEnquiries}</div>
                        <div className="text-sm text-purple-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>{stats.pendingEnquiries} Pending</span>
                        </div>
                    </div>
                </Motion.div>
            </div>

            {/* Visitor Analytics & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Visited Pages */}
                <Motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-xl flex flex-col h-full col-span-1"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-400" />
                            Top Pages
                        </h3>
                    </div>
                    <div className="p-4 space-y-4 flex-grow">
                        {stats.topPages.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 text-sm">No page data yet.</div>
                        ) : (
                            stats.topPages.map((item, index) => (
                                <div key={item.path} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs px-1">
                                        <span className="font-medium text-slate-300 truncate max-w-[140px]">{item.path}</span>
                                        <span className="font-bold text-white">{item.count}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{ width: `${Math.min(100, (item.count / (stats.topPages[0]?.count || 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Motion.div>

                {/* Technology & Browsers */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-xl flex flex-col h-full col-span-1"
                >
                    <div className="p-6 border-b border-white/5">
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            Visitor Tech
                        </h3>
                    </div>
                    <div className="p-6 space-y-8">
                        {/* Device Breakdown */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Device Types</h4>
                            <div className="flex items-center gap-2">
                                {stats.deviceStats.map((device) => (
                                    <div key={device.type} className="flex-grow group">
                                        <div className="text-center mb-2">
                                            <p className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase">{device.type}</p>
                                            <p className="text-lg font-black text-white">{device.count}</p>
                                        </div>
                                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-1000"
                                                style={{ width: `${(device.count / stats.totalVisits) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Browser Breakdown */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Top Browsers</h4>
                            <div className="space-y-3">
                                {stats.browserStats.map((browser) => (
                                    <div key={browser.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                                        <span className="text-xs font-bold text-slate-300">{browser.name}</span>
                                        <span className="text-xs font-black text-white bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400">{browser.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Motion.div>

                {/* Recent Visits Activity Log */}
                <Motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-xl flex flex-col h-full col-span-1"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-pink-400" />
                            Live Traffic
                        </h3>
                    </div>
                    <div className="p-4 space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar">
                        {stats.recentVisits.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 text-sm">No live data.</div>
                        ) : (
                            stats.recentVisits.map((visit) => (
                                <div key={visit.id} className="p-3 rounded-xl bg-slate-900/40 border border-white/5 text-[11px] space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-300 flex items-center gap-1.5">
                                            <Globe className="w-3 h-3 text-indigo-400" />
                                            {visit.country}
                                        </span>
                                        <span className="text-slate-600 text-[9px]">{formatDate(visit.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 truncate">
                                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[9px] text-white uppercase">{visit.device}</span>
                                        <span className="truncate">{visit.path}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Enquiries Feed */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-xl flex flex-col h-full lg:col-span-1"
                >
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Recent Enquiries
                        </h3>
                        <Link href="/admin/enquiries" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
                            View All
                        </Link>
                    </div>
                    <div className="p-4 space-y-2 flex-grow">
                        {stats.recentEnquiries.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 text-sm">No recent enquiries found.</div>
                        ) : (
                            stats.recentEnquiries.map((enquiry) => (
                                <div key={enquiry.id} className="p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:bg-slate-800/50 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors">{enquiry.userName}</h4>
                                            <p className="text-xs text-slate-400">{enquiry.userEmail}</p>
                                        </div>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${enquiry.status === 'PENDING' ? 'bg-orange-500/20 text-orange-400' :
                                            enquiry.status === 'REPLIED' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
                                            }`}>
                                            {enquiry.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-300 line-clamp-1 mb-2 italic">"{enquiry.message}"</div>
                                    <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-2">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Car className="w-3 h-3" />
                                            {enquiry.car?.make} {enquiry.car?.model}
                                        </span>
                                        <span className="text-[10px] text-slate-600"><FormattedDate date={enquiry.createdAt} showTime /></span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Motion.div>
            </div>

            {/* Recent Inventory Feed (Full Width) */}
            <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-card/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-xl flex flex-col"
            >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <Car className="w-5 h-5 text-blue-500" />
                        Latest Cars
                    </h3>
                    <Link href="/admin/cars" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">
                        Manage Inventory
                    </Link>
                </div>
                <div className="p-4 space-y-2 flex-grow">
                    {stats.recentCars.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 text-sm">No cars in inventory yet.</div>
                    ) : (
                        stats.recentCars.map((car) => (
                            <div key={car.id} className="p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:bg-slate-800/50 transition-colors flex items-center gap-4 group">
                                <div className="w-16 h-12 bg-slate-800 rounded-lg overflow-hidden shrink-0 relative">
                                    {/* Placeholder image logic would go here if needed, keeping it simple for dashboard list */}
                                    {car.images[0] && (
                                        <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h4 className="font-bold text-white text-sm truncate group-hover:text-blue-400 transition-colors">{car.make} {car.model}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                        <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] uppercase">{car.condition}</span>
                                        <span>•</span>
                                        <span className="text-emerald-400 font-medium">{formatCurrency(car.price)}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${car.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {car.status}
                                    </span>
                                    <div className="text-xs text-slate-600 mt-1"><FormattedDate date={car.createdAt} /></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Motion.div>
        </div>
    );
}
