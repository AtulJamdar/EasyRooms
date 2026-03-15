import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [resetUrl, setResetUrl] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const sendResetRequest = async (emailToSend) => {
        setStatus({ type: 'pending', message: 'Generating reset token…' });
        setResetUrl(null);
        setShowConfirm(false);

        try {
            const res = await api.post('/auth/forgot-password', { email: emailToSend });
            const { resetUrl: url, emailSent, emailError } = res.data;

            // Server will attempt to send the email via EmailJS if configured.
            setStatus({
                type: emailSent === false ? 'warning' : 'success',
                message:
                    emailSent === false
                        ? `Reset token generated, but sending email failed: ${emailError}. The reset link is shown below for testing.`
                        : 'If that email exists, you should receive a password reset link shortly. Check your inbox (and spam folder).',
            });

            if (url) {
                setResetUrl(url);
            }
        } catch (err) {
            setStatus({ type: 'error', message: err?.response?.data?.message || 'Unable to generate reset token' });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const confirmSend = () => {
        sendResetRequest(email);
    };

    const cancelConfirm = () => {
        setShowConfirm(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-indigo-100 text-slate-900 dark:from-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto w-full max-w-md px-6 py-16">
                <h1 className="text-2xl font-semibold">Forgot password</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Enter your email and we'll send you a link to reset your password.
                </p>

                <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl bg-white/80 p-8 shadow-lg dark:bg-slate-900/70">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                    >
                        Send reset link
                    </button>
                </form>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm reset request</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Send a password reset link to <span className="font-semibold text-slate-800 dark:text-white">{email}</span>?
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={cancelConfirm}
                                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmSend}
                                className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
                            >
                                Send email
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {status && (
                <div
                    className={`mt-6 rounded-xl p-4 text-sm ${
                        status.type === 'error'
                            ? 'bg-rose-600/30 text-rose-100'
                            : status.type === 'warning'
                            ? 'bg-yellow-600/30 text-yellow-100'
                            : 'bg-emerald-600/30 text-emerald-100'
                    }`}
                >
                    <p>{status.message}</p>
                </div>
            )}

            {resetUrl && (
                <div className="mt-4 rounded-xl bg-slate-900/20 p-4 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                    <p className="font-semibold">Reset link (for testing)</p>
                    <p className="mt-2 break-all text-xs font-semibold">{resetUrl}</p>
                </div>
            )}
        </main>
    </div>
);
}
