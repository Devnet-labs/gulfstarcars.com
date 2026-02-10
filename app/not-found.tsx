import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0F19] text-white p-4">
            <h2 className="text-4xl font-bold mb-4">Not Found</h2>
            <p className="text-gray-400 mb-8">Could not find requested resource</p>
            <Link
                href="/"
                className="px-6 py-3 bg-primary rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
                Return Home
            </Link>
        </div>
    );
}
