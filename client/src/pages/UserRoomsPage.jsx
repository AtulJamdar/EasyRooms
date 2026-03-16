import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function UserRoomsPage() {
    const { id } = useParams();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchRooms = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/rooms/user/${id}`);
                setRooms(res.data.rooms || []);
            } catch (err) {
                setError(err?.response?.data?.message || 'Unable to load listings');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-5xl px-6 py-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">User listings</h1>
                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                            These are the room posts shared by this user. Click a room to see full details.
                        </p>
                    </div>
                    <Link
                        to="/matches"
                        className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                    >
                        Back to matches
                    </Link>
                </div>

                {loading ? (
                    <div className="mt-10 flex justify-center">
                        <span className="animate-pulse rounded-full bg-indigo-500 px-6 py-2">Loading listings…</span>
                    </div>
                ) : error ? (
                    <div className="mt-10 rounded-xl bg-rose-700/40 p-6 text-sm text-rose-100">{error}</div>
                ) : rooms.length === 0 ? (
                    <div className="mt-10 rounded-xl bg-slate-800/50 p-6 text-sm text-slate-200">
                        This user has not posted any rooms yet.
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        {rooms.map((room) => (
                            <div
                                key={room._id}
                                className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg backdrop-blur"
                            >
                                {room.images?.length > 0 && (
                                    <div className="mb-4 overflow-hidden rounded-xl">
                                        <img
                                            src={room.images[0]}
                                            alt={room.title}
                                            className="h-40 w-full object-cover"
                                        />
                                    </div>
                                )}
                                <h2 className="text-lg font-semibold">{room.title}</h2>
                                <p className="mt-1 text-sm text-slate-300">{room.location}</p>
                                <p className="mt-3 text-sm text-slate-300">{room.description}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="rounded-full bg-indigo-500/30 px-4 py-2 text-xs font-semibold text-indigo-100">
                                        ₹{room.rent}
                                    </div>
                                    <Link
                                        to={`/rooms/${room._id}`}
                                        className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold text-indigo-100 hover:bg-indigo-500/40"
                                    >
                                        View details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
