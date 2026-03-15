import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import api, { setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext';

function StatCard({ title, value, description }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg">
            <div className="text-sm font-semibold text-slate-200">{title}</div>
            <div className="mt-2 text-3xl font-bold text-white">{value}</div>
            {description && <div className="mt-2 text-sm text-slate-300">{description}</div>}
        </div>
    );
}

export default function AdminDashboardPage() {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    const fetchStats = async () => {
        if (!token) return;
        setAuthToken(token);

        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
            setError(null);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load admin stats.');
        }
    };

    useEffect(() => {
        fetchStats();
    }, [token]);

    const updateActionLoading = (key, value) => {
        setActionLoading((prev) => ({ ...prev, [key]: value }));
    };

    const handleDeleteReportedPost = async (reportId) => {
        updateActionLoading(`delete-${reportId}`, true);
        try {
            await api.post(`/admin/reports/${reportId}/delete-post`);
            await fetchStats();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to delete post.');
        } finally {
            updateActionLoading(`delete-${reportId}`, false);
        }
    };

    const handleBlockReporter = async (reportId) => {
        updateActionLoading(`block-${reportId}`, true);
        try {
            await api.post(`/admin/reports/${reportId}/block-reporter`);
            await fetchStats();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to block reporter.');
        } finally {
            updateActionLoading(`block-${reportId}`, false);
        }
    };

    const handleResolveReport = async (reportId) => {
        updateActionLoading(`resolve-${reportId}`, true);
        try {
            await api.post(`/admin/reports/${reportId}/resolve`);
            await fetchStats();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to resolve report.');
        } finally {
            updateActionLoading(`resolve-${reportId}`, false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-6xl px-6 py-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
                        <p className="mt-1 text-sm text-slate-300">View platform activity, reported content, and business metrics.</p>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 rounded-xl bg-rose-700/40 p-6 text-sm text-rose-100">{error}</div>
                )}

                {!stats ? (
                    <div className="mt-8 rounded-xl bg-slate-900/40 p-6 text-sm text-slate-200">Loading stats…</div>
                ) : (
                    <>
                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            <StatCard title="Total users" value={stats.userCount} />
                            <StatCard title="Total room posts" value={stats.postCount} />
                            <StatCard title="Reported posts" value={stats.reportCount} />
                        </div>

                        <div className="mt-8 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg">
                                <h2 className="text-lg font-semibold">Rooms posted per week</h2>
                                {stats.roomsPerWeek?.length === 0 ? (
                                    <p className="mt-3 text-sm text-slate-300">Not enough data yet.</p>
                                ) : (
                                    <div className="mt-4 h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.roomsPerWeek} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                                <XAxis dataKey="week" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                                                <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.4)' }} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
                                                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg">
                                <h2 className="text-lg font-semibold">Top locations</h2>
                                {stats.topLocations.length === 0 ? (
                                    <p className="mt-3 text-sm text-slate-300">No location data available yet.</p>
                                ) : (
                                    <div className="mt-4 h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.4)' }} />
                                                <Pie
                                                    data={stats.topLocations}
                                                    dataKey="count"
                                                    nameKey="location"
                                                    innerRadius={50}
                                                    outerRadius={90}
                                                    fill="#6366f1"
                                                    label
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg">
                            <h2 className="text-lg font-semibold">Recent reports</h2>
                            {stats.reports.length === 0 ? (
                                <p className="mt-3 text-sm text-slate-300">No recent reports.</p>
                            ) : (
                                <ul className="mt-4 space-y-4 text-sm text-slate-200">
                                    {stats.reports.slice(0, 5).map((report) => (
                                        <li key={report._id} className="rounded-xl bg-slate-900/50 p-4">
                                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-white">{report.reason}</div>
                                                    <div className="text-xs text-slate-400">Reported on {new Date(report.createdAt).toLocaleString()}</div>

                                                    <div className="mt-2 rounded-xl bg-slate-800/40 p-3">
                                                        <div className="text-xs text-slate-300">
                                                            <span className="font-semibold text-slate-200">Post:</span>{' '}
                                                            {report.reportedPost?.title || 'Unknown'}
                                                        </div>
                                                        {report.reportedPost?.description && (
                                                            <div className="mt-1 text-xs text-slate-300">{report.reportedPost.description}</div>
                                                        )}
                                                        {report.reportedPost?.postedBy && (
                                                            <div className="mt-1 text-xs text-slate-300">
                                                                <span className="font-semibold text-slate-200">Posted by:</span>{' '}
                                                                {report.reportedPost.postedBy.name || report.reportedPost.postedBy.email}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        <span className="text-xs text-slate-400">
                                                            Reporter: {report.reportedBy?.name || report.reportedBy?.email}
                                                        </span>
                                                        {report.isResolved && (
                                                            <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-100">
                                                                Resolved
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleDeleteReportedPost(report._id)}
                                                        disabled={actionLoading[`delete-${report._id}`]}
                                                        className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                                            actionLoading[`delete-${report._id}`]
                                                                ? 'bg-rose-600/20 text-rose-200 cursor-not-allowed'
                                                                : 'bg-rose-600/30 text-rose-100 hover:bg-rose-600/60'
                                                        }`}
                                                    >
                                                        {actionLoading[`delete-${report._id}`] ? 'Deleting…' : 'Delete post'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleBlockReporter(report._id)}
                                                        disabled={actionLoading[`block-${report._id}`]}
                                                        className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                                            actionLoading[`block-${report._id}`]
                                                                ? 'bg-yellow-500/20 text-amber-200 cursor-not-allowed'
                                                                : 'bg-yellow-500/30 text-amber-100 hover:bg-yellow-500/60'
                                                        }`}
                                                    >
                                                        {actionLoading[`block-${report._id}`] ? 'Blocking…' : 'Block reporter'}
                                                    </button>
                                                    {!report.isResolved && (
                                                        <button
                                                            onClick={() => handleResolveReport(report._id)}
                                                            disabled={actionLoading[`resolve-${report._id}`]}
                                                            className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                                                actionLoading[`resolve-${report._id}`]
                                                                    ? 'bg-slate-600/20 text-slate-200 cursor-not-allowed'
                                                                    : 'bg-slate-600/30 text-slate-100 hover:bg-slate-600/60'
                                                            }`}
                                                        >
                                                            {actionLoading[`resolve-${report._id}`] ? 'Resolving…' : 'Mark resolved'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
