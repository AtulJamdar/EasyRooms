import { useState } from 'react';
import Navbar from '../components/Navbar';
import { sendEmail } from '../services/emailjsService';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null);

    const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'pending', message: 'Sending message…' });

        try {
            await sendEmail({
                to_name: form.name || 'Visitor',
                to_email: form.email,
                subject: 'Contact request from EasyRoom',
                message: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
            });
            setStatus({ type: 'success', message: 'Message sent! We will get back to you soon.' });
            setForm({ name: '', email: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Failed to send message' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-white">
            <Navbar />
            <main className="mx-auto w-full max-w-xl px-6 py-16">
                <h1 className="text-2xl font-semibold">Contact Us</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Have feedback or need help? Send us a message and we’ll respond as soon as we can.
                </p>

                <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl bg-white/80 p-8 shadow-lg dark:bg-slate-900/70">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={onChange}
                            rows={5}
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                    <button type="submit" className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400">
                        Send message
                    </button>
                </form>

                {status && (
                    <div className={`mt-6 rounded-xl p-4 text-sm ${status.type === 'error'
                            ? 'bg-rose-600/30 text-rose-100'
                            : 'bg-emerald-600/30 text-emerald-100'
                        }`}
                    >
                        {status.message}
                    </div>
                )}
            </main>
        </div>
    );
}
