import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function SavedRequirementsPage() {
    const [requirements, setRequirements] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState(null);

    const loadRequirements = async () => {
        try {
            const res = await api.get('/requirements');
            // API returns the array directly (not wrapped inside a `requirements` key)
            setRequirements(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setStatus({ type: 'error', message: err?.response?.data?.message || 'Failed to load saved requirements.' });
        }
    };

    useEffect(() => {
        loadRequirements();
    }, []);

    const createRequirement = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/requirements', { title, description });
            // API returns the created requirement object directly.
            setRequirements((prev) => [res.data, ...prev]);
            setTitle('');
            setDescription('');
            setStatus({ type: 'success', message: 'Requirement saved.' });
        } catch (err) {
            setStatus({ type: 'error', message: err?.response?.data?.message || 'Failed to save requirement.' });
        }
    };

    const deleteRequirement = async (id) => {
        try {
            await api.delete(`/requirements/${id}`);
            setRequirements((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            setStatus({ type: 'error', message: err?.response?.data?.message || 'Could not delete requirement.' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-4xl px-6 py-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Saved Requirements</h1>
                        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Keep your search preferences ready and revisit them anytime.</p>
                    </div>
                </div>

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

                <form onSubmit={createRequirement} className="mt-6 grid gap-4 rounded-2xl bg-slate-900/40 p-8 shadow-lg">
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <button type="submit" className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400">
                        Save requirement
                    </button>
                </form>

                <div className="mt-10 space-y-4">
                    {requirements.length === 0 ? (
                        <div className="rounded-xl bg-slate-800/50 p-6 text-sm text-slate-700 dark:text-slate-200">
                            No saved requirements yet.
                        </div>
                    ) : (
                        requirements.map((requirement) => (
                            <div
                                key={requirement._id}
                                className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg backdrop-blur"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold">{requirement.title}</h2>
                                        <p className="mt-1 text-sm text-slate-300">{requirement.description}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteRequirement(requirement._id)}
                                        className="rounded-md bg-rose-500/40 px-3 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-500/60"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
