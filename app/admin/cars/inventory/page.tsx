
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Edit, Eye, Trash2, Calendar, Hash, Tag, Info } from 'lucide-react';

export default async function InventoryTablePage() {
    const cars = await prisma.car.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory Table</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Detailed overview of all vehicles in system
                    </p>
                </div>
                <div className="flex gap-3 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {cars.filter(c => c.status === 'AVAILABLE').length} Available
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-3 w-3" />
                                        Stock ID
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                    Photo
                                </th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                    Vehicle Name
                                </th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-3 w-3" />
                                        Status
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        Added Date
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Info className="h-3 w-3" />
                                        Description
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {cars.map((car) => (
                                <tr key={car.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-mono text-sm font-bold text-primary">
                                            {car.customId || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-12 w-20 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                                            {car.images?.[0] ? (
                                                <img
                                                    src={car.images[0]}
                                                    alt={car.model}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white group-hover:text-primary transition-colors">
                                                {car.make} {car.model}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">{car.year} • {car.bodyType || car.condition}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${car.status === 'AVAILABLE'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : car.status === 'SOLD'
                                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {car.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-slate-400 font-medium">
                                            {new Date(car.createdAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-sm text-slate-500 line-clamp-1 italic font-medium">
                                            {car.description}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/cars/${car.id}`}
                                                className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-sm border border-white/5"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/cars/${car.id}/edit`}
                                                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-sm border border-primary/20"
                                                title="Edit Car"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
