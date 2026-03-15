import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api, { setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyPostsPage() {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (!token) return;
        setAuthToken(token);

        (async () => {
            try {
                const res = await api.get('/rooms/mine');
                setPosts(res.data.rooms || []);
            } catch (err) {
                setError(err?.response?.data?.message || err.message || 'Unable to load your posts');
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const deletePost = async (id) => {
        if (!window.confirm('Delete this post? This cannot be undone.')) return;

        try {
            await api.delete(`/rooms/${id}`);
            setPosts((prev) => prev.filter((p) => p._id !== id));
            setStatus({ type: 'success', message: 'Post deleted.' });
        } catch (err) {
            setStatus({ type: 'error', message: err?.response?.data?.message || 'Could not delete post.' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-5xl px-6 py-10">
                <h1 className="text-2xl font-semibold">My Room Posts</h1>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                    View and manage the rooms you have posted. If you want to remove a post, delete it from the post details.
                </p>

                {status && (
                    <div
                        className={`mt-6 rounded-lg px-4 py-3 text-sm ${status.type === 'error'
                                ? 'bg-rose-600/30 text-rose-100'
                                : status.type === 'success'
                                    ? 'bg-emerald-600/30 text-emerald-100'
                                    : 'bg-slate-700/40 text-slate-100'
                            }`}
                    >
                        {status.message}
                    </div>
                )}

                {loading ? (
                    <div className="mt-12 flex justify-center">
                        <span className="animate-pulse rounded-full bg-indigo-500 px-6 py-2">Loading…</span>
                    </div>
                ) : error ? (
                    <div className="mt-12 rounded-xl bg-rose-700/40 p-6">
                        <h2 className="text-lg font-semibold">Error</h2>
                        <p className="mt-2 text-sm text-rose-100">{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="mt-12 rounded-xl bg-slate-800/50 p-6 text-sm text-slate-200">
                        You haven't posted any rooms yet. Create a post from the "Post a room" page.
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        {posts.map((room) => (
                            <div
                                key={room._id}
                                className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg backdrop-blur"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">{room.title}</h2>
                                        <p className="text-sm text-slate-300">{room.location}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-indigo-500/30 px-4 py-2 text-xs font-semibold text-indigo-100">
                                            ₹{room.rent}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => deletePost(room._id)}
                                            className="rounded-md bg-rose-600/20 px-3 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-600/40"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm text-slate-300">{room.description}</p>
                                <div className="mt-4 text-xs text-slate-400">
                                    Posted on {new Date(room.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
