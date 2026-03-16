import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function PostRoomPage() {
    const [form, setForm] = useState({ title: '', description: '', rent: '', location: '', numberOfRoommatesNeeded: 1 });
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState(null);

    const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

        try {
            const encoded = await Promise.all(files.map(toBase64));
            setImages((prev) => [...prev, ...encoded].slice(0, 5));
        } catch (err) {
            console.error('Failed to read images', err);
        }
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'pending', message: 'Posting room…' });
        try {
            await api.post('/rooms', {
                title: form.title,
                description: form.description,
                rent: Number(form.rent),
                location: form.location,
                numberOfRoommatesNeeded: Number(form.numberOfRoommatesNeeded) || 1,
                images,
            });
            setStatus({ type: 'success', message: 'Room posted successfully.' });
            setForm({ title: '', description: '', rent: '', location: '', numberOfRoommatesNeeded: 1 });
            setImages([]);
        } catch (err) {
            setStatus({ type: 'error', message: err?.response?.data?.message || 'Failed to post room.' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-3xl px-6 py-10">
                <h1 className="text-2xl font-semibold">Post a Room</h1>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Share your room listing with the community.</p>

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

                <form onSubmit={onSubmit} className="mt-8 grid gap-5 rounded-2xl bg-slate-900/40 p-8 shadow-lg">
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Title</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={onChange}
                            required
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Location</label>
                        <input
                            name="location"
                            value={form.location}
                            onChange={onChange}
                            required
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Rent (₹)</label>
                        <input
                            name="rent"
                            type="number"
                            value={form.rent}
                            onChange={onChange}
                            required
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300">Roommates needed</label>
                        <input
                            name="numberOfRoommatesNeeded"
                            type="number"
                            min={1}
                            value={form.numberOfRoommatesNeeded}
                            onChange={onChange}
                            required
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300">Photos (optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        {images.length > 0 && (
                            <div className="mt-3 grid grid-cols-3 gap-2">
                                {images.map((src, idx) => (
                                    <div key={idx} className="relative">
                                        <img src={src} alt={`Room photo ${idx + 1}`} className="h-24 w-full rounded-lg object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            rows={4}
                            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400"
                    >
                        Post room
                    </button>
                </form>
            </main>
        </div>
    );
}
