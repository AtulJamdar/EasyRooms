import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

export default function MatchesPage() {
    const { token, clearToken } = useAuth();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;
        setAuthToken(token);

        (async () => {
            try {
                const { userId } = jwtDecode(token);

                if (!userId) {
                    throw new Error('Unable to determine current user from token');
                }

                const res = await api.get(`/matches/${userId}`);
                setMatches(res.data.matches || []);
            } catch (err) {
                setError(err?.response?.data?.message || err.message || 'Failed to load matches');
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const logout = () => {
        clearToken();
        setAuthToken(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <header className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Roommate Matches</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Browse compatible classmates for your next room.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/profile"
                        className="inline-flex items-center gap-2 rounded-md bg-slate-800/70 px-4 py-2 text-sm hover:bg-slate-700"
                    >
                        <User className="h-4 w-4" />
                        Profile
                    </Link>
                    <button
                        onClick={logout}
                        className="inline-flex items-center gap-2 rounded-md bg-slate-800/70 px-4 py-2 text-sm hover:bg-slate-700"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </header>

            <main className="px-6 pb-16">
                {loading ? (
                    <div className="mt-12 flex justify-center">
                        <span className="animate-pulse rounded-full bg-indigo-500 px-6 py-2">Loading matches…</span>
                    </div>
                ) : error ? (
                    <div className="mt-12 rounded-xl bg-rose-700/40 p-6">
                        <h2 className="text-lg font-semibold">Error</h2>
                        <p className="mt-2 text-sm text-rose-100">{error}</p>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="mt-12 rounded-xl bg-slate-800/50 p-6">
                        <p className="text-sm text-slate-200">No matches found yet. Try updating your profile or posting a room.</p>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        {matches.map(({ user, score }) => (
                            <div
                                key={user._id}
                                className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg backdrop-blur"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">{user.name}</h2>
                                        <p className="text-sm text-slate-300">{user.email}</p>
                                    </div>
                                    <div className="rounded-full bg-indigo-500/30 px-4 py-2 text-xs font-semibold text-indigo-100">
                                        Score {score}
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-2 text-sm text-slate-300">
                                    <div>
                                        <span className="font-medium text-slate-200">College:</span> {user.college || '—'}
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-200">Course:</span> {user.course || '—'}
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-200">Year:</span> {user.year || '—'}
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-200">Budget:</span> {user.budget ? `₹${user.budget}` : '—'}
                                    </div>
                                    {user.lifestyleHabits?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {user.lifestyleHabits.map((habit) => (
                                                <span
                                                    key={habit}
                                                    className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs"
                                                >
                                                    {habit}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex flex-col gap-2">
                                    <Link
                                        to={`/users/${user._id}/rooms`}
                                        className="rounded-md bg-indigo-500/20 px-3 py-2 text-sm font-semibold text-indigo-100 hover:bg-indigo-500/40"
                                    >
                                        View their room listings
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
