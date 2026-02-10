import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ReplyForm } from '@/components/ReplyForm';
import { use } from 'react';
import { FormattedDate } from '@/components/FormattedDate';

// Mock data helper
const getMockEnquiry = (id: string) => {
    if (id === '1') return {
        id: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        message: 'Is this car available for export to Dubai?',
        status: 'PENDING',
        createdAt: new Date(),
        car: { make: 'Toyota', model: 'Land Cruiser', year: 2024, id: 'mock-1', customId: 'CE-1001' }
    };
    return null;
};

export default async function EnquiryDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params; // Next.js 15 requires awaiting params

    let enquiry: {
        id: string;
        userName: string;
        userEmail: string;
        message: string;
        status: string;
        createdAt: Date;
        car: { make: string; model: string; year: number; id: string; customId: string | null } | null
    } | null = null;
    try {
        enquiry = await prisma.enquiry.findUnique({
            where: { id: params.id },
            include: { car: true },
        });
    } catch (e) {
        console.warn("DB fetch failed, using mock");
        enquiry = getMockEnquiry(params.id);
    }

    if (!enquiry) {
        // In demo mode without DB, we might want to show at least one mock for ID '1'
        if (params.id === '1') enquiry = getMockEnquiry('1');
        else return notFound();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Enquiry Details</h1>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">User Name</h3>
                        <p className="font-medium">{enquiry!.userName}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">User Email</h3>
                        <p className="font-medium">{enquiry!.userEmail}</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                        <p className="font-medium"><FormattedDate date={enquiry!.createdAt} showTime /></p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${enquiry!.status === 'REPLIED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {enquiry!.status}
                        </span>
                    </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-secondary/30 p-6 mt-6 shadow-lg">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Interested Vehicle</h3>
                    <div className="flex gap-6 items-center">
                        {/* Could add image here if available in model */}
                        <div>
                            <p className="text-xl font-bold text-white mb-1">{enquiry!.car!.year} {enquiry!.car!.make} {enquiry!.car!.model}</p>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center rounded-md bg-primary/20 px-2.5 py-1 text-xs font-black text-primary uppercase tracking-wider ring-1 ring-inset ring-primary/40">
                                    Stock ID: {enquiry!.car!.customId || 'N/A'}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">UID: {enquiry!.car!.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                    <h3 className="font-semibold mb-2">Message</h3>
                    <p className="whitespace-pre-wrap text-muted-foreground">{enquiry!.message}</p>
                </div>
            </div>

            <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-4">Reply to Enquiry</h2>
                <ReplyForm enquiry={enquiry!} />
            </div>
        </div>
    );
}
