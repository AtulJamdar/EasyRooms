import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function useDebouncedValue(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    const timer = useRef(null);

    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer.current);
    }, [value, delay]);

    return debounced;
}

export default function SearchRoomsPage() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 300);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedRoomId, setExpandedRoomId] = useState(null);

    const handleReport = async (roomId) => {
        const reason = window.prompt('Please describe why you are reporting this listing:');
        if (!reason) return;

        try {
            await api.post(`/rooms/${roomId}/report`, { reason });
            alert('Thanks for reporting. Our team will review this listing shortly.');
        } catch (err) {
            alert(err?.response?.data?.message || 'Failed to send report');
        }
    };

    useEffect(() => {
        if (!debouncedQuery) {
            setResults([]);
            setError(null);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        api
            .get(`/rooms/search`, { params: { query: debouncedQuery }, signal: controller.signal })
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : res.data.rooms || [];
                setResults(data);
            })
            .catch((err) => {
                if (err.name === 'CanceledError') return;
                setError(err?.response?.data?.message || 'Search failed');
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [debouncedQuery]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-5xl px-6 py-10">
                <h1 className="text-2xl font-semibold">Search Rooms</h1>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Find rooms that match your needs.</p>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by location, title, or description"
                        className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Type to search (auto-updates)</span>
                </div>

                {loading && (
                    <div className="mt-8 rounded-xl bg-slate-900/50 p-6 text-center text-sm text-slate-200">
                        Searching…
                    </div>
                )}

                {error && (
                    <div className="mt-8 rounded-xl bg-rose-700/40 p-6 text-sm text-rose-100">{error}</div>
                )}

                {!loading && !error && results.length === 0 && query && (
                    <div className="mt-8 rounded-xl bg-slate-800/50 p-6 text-sm text-slate-200">
                        No rooms found for "{query}".
                    </div>
                )}

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {results.map((room) => (
                        <div key={room._id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg backdrop-blur">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold">{room.title}</h2>
                                    <p className="text-sm text-slate-300">{room.location}</p>
                                </div>
                                <div className="rounded-full bg-indigo-500/30 px-4 py-2 text-xs font-semibold text-indigo-100">
                                    ₹{room.rent}
                                </div>
                            </div>
                            <p className="mt-4 text-sm text-slate-300">{room.description}</p>

                            <div className="mt-4 flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => setExpandedRoomId((prev) => (prev === room._id ? null : room._id))}
                                    className="inline-flex items-center justify-center rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold text-indigo-100 hover:bg-indigo-500/40"
                                >
                                    {expandedRoomId === room._id ? 'Hide contact info' : 'Show contact info'}
                                </button>

                                {expandedRoomId === room._id && (
                                    <div className="rounded-xl bg-slate-800/40 p-4 text-sm text-slate-200">
                                        <div>
                                            <span className="font-medium text-slate-200">Posted by:</span> {room.postedBy?.name || 'Unknown'}
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-200">Email:</span>{' '}
                                            <a
                                                href={`mailto:${room.postedBy?.email}`}
                                                className="underline hover:text-indigo-200"
                                            >
                                                {room.postedBy?.email || 'Not available'}
                                            </a>
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-200">Phone:</span>{' '}
                                            <a
                                                href={`tel:${room.postedBy?.phone}`}
                                                className="underline hover:text-indigo-200"
                                            >
                                                {room.postedBy?.phone || 'Not available'}
                                            </a>
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-200">College:</span> {room.postedBy?.college || '—'}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleReport(room._id)}
                                    className="inline-flex items-center justify-center rounded-md bg-rose-600/20 px-3 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-600/40"
                                >
                                    Report listing
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
