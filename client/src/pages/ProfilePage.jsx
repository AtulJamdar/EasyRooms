import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function ProfilePage() {
    const { token, clearToken } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;
        setAuthToken(token);

        (async () => {
            try {
                const res = await api.get('/auth/profile');
                const user = res.data.user || {};
                reset({
                    ...user,
                    lifestyleHabits: (user.lifestyleHabits || []).join(', '),
                });
            } catch (err) {
                setError(err?.response?.data?.message || err.message || 'Unable to load profile');
            } finally {
                setLoading(false);
            }
        })();
    }, [token, reset]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                lifestyleHabits: data.lifestyleHabits
                    ? data.lifestyleHabits
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean)
                    : [],
            };

            await api.put('/auth/profile', payload);
            alert('Profile updated successfully');
        } catch (err) {
            alert(err?.response?.data?.message || 'Update failed');
        }
    };

    const logout = () => {
        clearToken();
        setAuthToken(null);
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <span className="animate-pulse rounded-full bg-indigo-500 px-6 py-3">Loading profile…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="rounded-xl bg-rose-800/60 p-8">
                    <h2 className="text-xl font-semibold">Error</h2>
                    <p className="mt-2 text-sm text-rose-100">{error}</p>
                    <button
                        onClick={logout}
                        className="mt-4 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <div className="mx-auto max-w-2xl px-6 py-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Your Profile</h1>
                        <p className="text-sm text-slate-300">Keep your details up to date for better matches.</p>
                    </div>
                    <button
                        onClick={logout}
                        className="rounded-md bg-slate-800/70 px-4 py-2 text-sm hover:bg-slate-700"
                    >
                        Sign out
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6 rounded-2xl bg-slate-900/40 p-8 shadow-lg">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Name</label>
                            <input
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register('name')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Phone</label>
                            <input
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register('phone')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">College</label>
                            <input
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register('college')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Course</label>
                            <input
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register('course')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Year</label>
                            <input
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register('year')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Gender</label>
                            <select
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register('gender')}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">Budget (₹)</label>
                            <input
                                type="number"
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register('budget', { valueAsNumber: true })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-300">Lifestyle habits (comma separated)</label>
                            <input
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                {...register('lifestyleHabits')}
                            />
                            <p className="mt-1 text-xs text-slate-400">Example: quiet, early-riser, night-owl</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Saving…' : 'Save profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
