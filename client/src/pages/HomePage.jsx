import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-6 py-20 text-center">
                <h1 className="text-4xl font-semibold sm:text-5xl">EasyRoom</h1>
                <p className="max-w-2xl text-lg text-slate-700 dark:text-slate-200">
                    Find the perfect roommate and the ideal room on one platform. Post rooms, save your
                    preferences, and get matched with compatible classmates.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/40 transition hover:bg-indigo-400"
                    >
                        Get started
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center rounded-md border border-slate-300/40 bg-white/10 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/20 dark:border-white/20 dark:text-white"
                    >
                        Already have an account
                    </Link>
                </div>

                <div className="mx-auto grid max-w-3xl gap-8 rounded-3xl bg-white/10 p-10 shadow-lg shadow-black/20">
                    <div className="grid gap-2">
                        <h2 className="text-lg font-semibold">What you can do</h2>
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                            Post a room, search listings, save your roommate preferences, and receive
                            matches based on shared habits and budget.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-900/40 p-5">
                            <h3 className="font-semibold">Post a room</h3>
                            <p className="mt-1 text-sm text-slate-300">
                                Add your room listing and start receiving interest from compatible roommates.
                            </p>
                        </div>
                        <div className="rounded-xl bg-slate-900/40 p-5">
                            <h3 className="font-semibold">Find a roommate</h3>
                            <p className="mt-1 text-sm text-slate-300">
                                Build your profile, save your preferences, and see who matches your lifestyle.
                            </p>
                        </div>
                        <div className="rounded-xl bg-slate-900/40 p-5">
                            <h3 className="font-semibold">Save requirements</h3>
                            <p className="mt-1 text-sm text-slate-300">
                                Keep your search filters handy and get notified when a matching room is posted.
                            </p>
                        </div>
                        <div className="rounded-xl bg-slate-900/40 p-5">
                            <h3 className="font-semibold">Track notifications</h3>
                            <p className="mt-1 text-sm text-slate-300">
                                Stay informed when new matches appear or when posts are flagged.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
