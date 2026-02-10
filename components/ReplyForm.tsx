'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ReplyFormProps {
    enquiry: {
        id: string;
        userName: string;
        userEmail: string;
        car?: { make: string; model: string; year: number } | null;
    };
}

export function ReplyForm({ enquiry }: ReplyFormProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    // Default subject based on car
    const defaultSubject = enquiry.car
        ? `Re: Your enquiry about ${enquiry.car.year} ${enquiry.car.make} ${enquiry.car.model}`
        : `Re: Your enquiry to AutoExport`;

    const [subject, setSubject] = useState(defaultSubject);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        try {
            const response = await fetch('/api/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiryId: enquiry.id,
                    userEmail: enquiry.userEmail,
                    replyMessage: message,
                    subject: subject,
                }),
            });

            if (response.ok) {
                setIsSent(true);
                setMessage('');
            } else {
                alert('Failed to send reply');
            }
        } catch (error) {
            console.error(error);
            alert('Error sending reply');
        } finally {
            setIsSending(false);
        }
    };

    if (isSent) {
        return (
            <div className="rounded-lg bg-green-50 p-6 border border-green-200 text-center">
                <h3 className="text-lg font-semibold text-green-800">Reply Sent Successfully</h3>
                <p className="text-green-600">The customer has been notified via email.</p>
                <button
                    onClick={() => setIsSent(false)}
                    className="mt-4 text-sm font-medium text-green-700 hover:underline"
                >
                    Send another reply
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSend} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium">To</label>
                <input
                    type="text"
                    value={`${enquiry.userName} <${enquiry.userEmail}>`}
                    disabled
                    className="w-full rounded-lg border bg-muted px-3 py-2 text-muted-foreground"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Subject</label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Message</label>
                <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Type your reply here..."
                    required
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSending}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {isSending ? 'Sending...' : 'Send Reply'}
                </button>
            </div>
        </form>
    );
}
