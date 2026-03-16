import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function RoomDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchRoom = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/rooms/${id}`);
                setRoom(res.data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Unable to load room details');
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    const handleReport = async () => {
        const reason = window.prompt('Please describe why you are reporting this listing:');
        if (!reason) return;

        try {
            await api.post(`/rooms/${id}/report`, { reason });
            setStatus({ type: 'success', message: 'Thanks for reporting. Our team will review this listing shortly.' });
        } catch (err) {
            setStatus({ type: 'error', message: err?.response?.data?.message || 'Failed to send report' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-5xl px-6 py-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Room details</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            View full details for this listing.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-md bg-slate-900/20 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-900/30 dark:bg-slate-700/30 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                        Back
                    </button>
                </div>

                {loading ? (
                    <div className="mt-10 flex justify-center">
                        <span className="animate-pulse rounded-full bg-indigo-500 px-6 py-2">Loading…</span>
                    </div>
                ) : error ? (
                    <div className="mt-10 rounded-xl bg-rose-700/40 p-6 text-sm text-rose-100">
                        {error}
                        <div className="mt-4">
                            <Link
                                to="/search-rooms"
                                className="text-indigo-200 underline hover:text-white"
                            >
                                Back to search
                            </Link>
                        </div>
                    </div>
                ) : (
                    room && (
                        <div className="mt-8 grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                {room.images?.length > 0 ? (
                                    <div className="grid gap-3 lg:grid-cols-2">
                                        {room.images.map((src, idx) => (
                                            <img
                                                key={idx}
                                                src={src}
                                                alt={`${room.title} photo ${idx + 1}`}
                                                className="h-60 w-full rounded-xl object-cover"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex h-60 items-center justify-center rounded-xl bg-slate-900/40 text-sm text-slate-200">
                                        No photos provided
                                    </div>
                                )}

                                <div className="mt-8 rounded-2xl bg-slate-900/40 p-6 shadow-lg">
                                    <h2 className="text-xl font-semibold">About this room</h2>
                                    <p className="mt-4 text-sm leading-relaxed text-slate-200">{room.description}</p>
                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-xl bg-slate-800/40 p-4">
                                            <div className="text-xs font-semibold text-slate-300">Rent</div>
                                            <div className="mt-1 text-lg font-semibold text-white">₹{room.rent}</div>
                                        </div>
                                        <div className="rounded-xl bg-slate-800/40 p-4">
                                            <div className="text-xs font-semibold text-slate-300">Location</div>
                                            <div className="mt-1 text-lg font-semibold text-white">{room.location}</div>
                                        </div>
                                        <div className="rounded-xl bg-slate-800/40 p-4">
                                            <div className="text-xs font-semibold text-slate-300">Roommates needed</div>
                                            <div className="mt-1 text-lg font-semibold text-white">{room.numberOfRoommatesNeeded}</div>
                                        </div>
                                        <div className="rounded-xl bg-slate-800/40 p-4">
                                            <div className="text-xs font-semibold text-slate-300">Posted</div>
                                            <div className="mt-1 text-lg font-semibold text-white">{new Date(room.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-2xl bg-slate-900/40 p-6 shadow-lg">
                                    <h3 className="text-lg font-semibold">Contact</h3>
                                    <div className="mt-4 text-sm text-slate-200">
                                        <div>
                                            <span className="font-semibold text-slate-100">Posted by:</span>{' '}
                                            {room.postedBy?.name || 'Unknown'}
                                        </div>
                                        <div className="mt-2">
                                            <span className="font-semibold text-slate-100">Email:</span>{' '}
                                            {room.postedBy?.email ? (
                                                <a
                                                    href={`mailto:${room.postedBy.email}`}
                                                    className="underline hover:text-indigo-200"
                                                >
                                                    {room.postedBy.email}
                                                </a>
                                            ) : (
                                                'Not available'
                                            )}
                                        </div>
                                        <div className="mt-2">
                                            <span className="font-semibold text-slate-100">Phone:</span>{' '}
                                            {room.postedBy?.phone ? (
                                                <a
                                                    href={`tel:${room.postedBy.phone}`}
                                                    className="underline hover:text-indigo-200"
                                                >
                                                    {room.postedBy.phone}
                                                </a>
                                            ) : (
                                                'Not available'
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-slate-900/40 p-6 shadow-lg">
                                    <h3 className="text-lg font-semibold">Report listing</h3>
                                    <p className="mt-2 text-sm text-slate-300">
                                        If this listing violates the rules, you can report it for review.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleReport}
                                        className="mt-4 w-full rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500"
                                    >
                                        Report this listing
                                    </button>
                                </div>

                                {status && (
                                    <div
                                        className={`rounded-xl p-4 text-sm ${status.type === 'error'
                                                ? 'bg-rose-600/30 text-rose-100'
                                                : 'bg-emerald-600/30 text-emerald-100'
                                            }`}
                                    >
                                        {status.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )}
            </main>
        </div>
    );
}
