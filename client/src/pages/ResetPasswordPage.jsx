import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordPage() {
    const query = useQuery();
    const token = query.get('token');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setStatus({ type: 'error', message: 'Reset token is missing. Please use the link from your email.' });
            return;
        }

        setStatus({ type: 'pending', message: 'Resetting your password…' });
        try {
            await api.post('/auth/reset-password', { token, password });
            setStatus({ type: 'success', message: 'Password has been reset. Redirecting to login…' });
            setTimeout(() => navigate('/login'), 1800);
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to reset password';
            const isTokenInvalid = /invalid|expired/i.test(message);

            setStatus({
                type: 'error',
                message,
                isTokenInvalid,
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-indigo-100 text-slate-900 dark:from-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto w-full max-w-md px-6 py-16">
                <h1 className="text-2xl font-semibold">Reset password</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Choose a new password for your account.
                </p>

                <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl bg-white/80 p-8 shadow-lg dark:bg-slate-900/70">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">New password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                    >
                        Reset password
                    </button>
                </form>

                {status && (
                    <div className={`mt-6 rounded-xl p-4 text-sm ${status.type === 'error'
                        ? 'bg-rose-600/30 text-rose-100'
                        : status.type === 'success'
                            ? 'bg-emerald-600/30 text-emerald-100'
                            : 'bg-slate-700/30 text-slate-100'
                        }`}
                    >
                        <p>{status.message}</p>
                        {status.isTokenInvalid && (
                            <div className="mt-3 rounded-lg bg-white/20 p-3 text-xs text-slate-100">
                                <p>
                                    It looks like the link is invalid or has expired. You can request a new reset link below.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="mt-3 inline-flex items-center justify-center rounded-md bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
                                >
                                    Request a new reset link
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
