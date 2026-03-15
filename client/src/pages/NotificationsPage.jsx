import Navbar from '../components/Navbar';

export default function NotificationsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-900 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-4xl px-6 py-10">
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <p className="mt-2 text-sm text-slate-300">
                    This area will show alerts when new rooms match your saved requirements or suspicious activity is detected.
                </p>

                <div className="mt-8 rounded-2xl bg-slate-900/40 p-8 shadow-lg">
                    <div className="text-sm text-slate-300">
                        <p className="mb-3">No notifications yet.</p>
                        <p>If you save requirements and the system detects a matching room post, notifications will appear here.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
