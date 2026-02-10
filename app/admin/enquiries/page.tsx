'use client';

import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Eye, Mail, CheckCircle, Clock, X, Send } from 'lucide-react';
import { notFound } from 'next/navigation';
import { FormattedDate } from '@/components/FormattedDate';
import { useState, useTransition, useEffect } from 'react';
import { toast } from 'sonner';
import { replyToEnquiry } from '@/app/actions/replyToEnquiry';
import { useRouter } from 'next/navigation';
import { getEnquiries } from '@/app/actions/getEnquiries'; // We need a server action or API to fetch data if we use client component

// Types
type EnquiryWithCar = {
    id: string;
    userName: string;
    userEmail: string;
    message: string;
    status: string;
    createdAt: Date;
    car: { make: string; model: string; year: number; id: string; customId: string | null } | null;
};

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<EnquiryWithCar[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryWithCar | null>(null);
    const [isPending, startTransition] = useTransition();
    const [replyMessage, setReplyMessage] = useState('');
    const [replySubject, setReplySubject] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching from an API route or server action is better for client components
                // For now, we'll use a fetch to the existing API if possible, or a new server action
                // Since we can't easily export prisma in client component...
                // Let's rely on a server action I will create in a moment
                const data = await getEnquiries();
                setEnquiries(data as unknown as EnquiryWithCar[]);
            } catch (error) {
                console.error("Failed to fetch enquiries", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenReply = (enquiry: EnquiryWithCar) => {
        setSelectedEnquiry(enquiry);
        setReplySubject(`Re: Enquiry about ${enquiry.car ? `${enquiry.car.year} ${enquiry.car.make}` : 'General Enquiry'}`);
        setReplyMessage(`Dear ${enquiry.userName},\n\nThank you for your enquiry.\n\n`);
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEnquiry) return;

        const formData = new FormData();
        formData.append('enquiryId', selectedEnquiry.id);
        formData.append('subject', replySubject);
        formData.append('message', replyMessage);

        startTransition(async () => {
            const result = await replyToEnquiry(null, formData);
            if (result.success) {
                toast.success(`Email sent successfully to ${selectedEnquiry.userEmail}`);
                setSelectedEnquiry(null);
                setReplyMessage('');
                // Refresh list to update status
                const data = await getEnquiries();
                setEnquiries(data as unknown as EnquiryWithCar[]);
            } else {
                toast.error(result.error || "Failed to send email. Please retry.");
            }
        });
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-400">Loading enquiries...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Enquiries</h1>
            </div>

            <div className="rounded-xl border border-white/5 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b border-white/5">
                        <tr className="border-b border-white/5 transition-colors hover:bg-white/5 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 align-middle font-medium text-slate-400">Status</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-400">User</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-400">Car</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-400">Message Preview</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-400">Date</th>
                            <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {enquiries.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-500">
                                    No enquiries found.
                                </td>
                            </tr>
                        ) : (
                            enquiries.map((enquiry) => (
                                <tr key={enquiry.id} className="border-b border-white/5 transition-colors hover:bg-white/5">
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase transition-colors ${enquiry.status === 'REPLIED'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                            {enquiry.status === 'REPLIED' ? <CheckCircle className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                                            {enquiry.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="font-medium text-white">{enquiry.userName}</div>
                                        <div className="text-xs text-slate-400">{enquiry.userEmail}</div>
                                    </td>
                                    <td className="p-4 align-middle text-slate-300">
                                        {enquiry.car ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-white">{enquiry.car.year} {enquiry.car.make} {enquiry.car.model}</span>
                                                <span className="inline-flex items-center self-start rounded-md bg-primary/20 px-2 py-0.5 text-[10px] font-black text-primary uppercase tracking-wider ring-1 ring-inset ring-primary/40">
                                                    Stock ID: {enquiry.car.customId || 'N/A'}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-500 font-medium">General Enquiry</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle max-w-xs truncate text-slate-400">
                                        {enquiry.message}
                                    </td>
                                    <td className="p-4 align-middle whitespace-nowrap text-slate-400">
                                        <FormattedDate date={enquiry.createdAt} showTime />
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenReply(enquiry)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                                                title="Reply"
                                            >
                                                <Mail className="h-4 w-4" />
                                            </button>
                                            <Link
                                                href={`/admin/enquiries/${enquiry.id}`}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-colors text-slate-400"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">View</span>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reply Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                Reply to {selectedEnquiry.userName}
                            </h3>
                            <button onClick={() => setSelectedEnquiry(null)} className="rounded-full p-1 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSendReply} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={replySubject}
                                    onChange={(e) => setReplySubject(e.target.value)}
                                    className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Message</label>
                                <textarea
                                    rows={8}
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    className="w-full rounded-lg bg-black/20 border border-white/10 px-3 py-2 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    {isPending ? 'Sending...' : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Send Reply
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
