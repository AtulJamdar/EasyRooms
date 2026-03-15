import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Home, User, LogOut, ClipboardList, Search, Bell, PlusCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const { token, user, clearToken } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // DEBUG: log auth state (remove in production)
    useEffect(() => {
        console.debug('Navbar auth state', { tokenExists: !!token, user });
    }, [token, user]);

    // Some legacy seeds may set `isAdmin` instead of `role`.
    const isAdmin = (user?.role || '').toLowerCase() === 'admin' || user?.isAdmin;

    const logout = () => {
        clearToken();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-700/30 bg-slate-900/60 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Home className="h-5 w-5" />
                    <span>EasyRoom</span>
                </Link>

                <div className="hidden items-center gap-2 md:flex">
                    {token ? (
                        <>
                            <Link
                                to="/matches"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                Matches
                            </Link>
                            <Link
                                to="/post-room"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                Post a room
                            </Link>
                            <Link
                                to="/my-posts"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                My posts
                            </Link>
                            <Link
                                to="/search-rooms"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                Search rooms
                            </Link>
                            <Link
                                to="/saved-requirements"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                Saved requirements
                            </Link>
                            <Link
                                to="/notifications"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                Notifications
                            </Link>
                            <Link
                                to="/profile"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                Profile
                            </Link>
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                                >
                                    <LayoutDashboard className="inline-block h-4 w-4" />
                                    <span className="ml-1">Admin</span>
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                <LogOut className="inline-block h-4 w-4" />
                                <span className="ml-1">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    <button
                        onClick={toggleTheme}
                        className="rounded-md bg-slate-800/60 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700/70"
                        title="Toggle theme"
                    >
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 md:hidden"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <span>Menu</span>
                    <span className="text-xs">{open ? '▲' : '▼'}</span>
                </button>
            </div>

            {open && (
                <div className="border-t border-slate-700/30 bg-slate-900/90 px-4 py-3 md:hidden">
                    <div className="flex flex-col gap-2">
                        {token ? (
                            <>
                                <Link to="/matches" className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60">
                                    Matches
                                </Link>
                                <Link to="/post-room" className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60">
                                    Post a room
                                </Link>
                                <Link to="/my-posts" className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60">
                                    My posts
                                </Link>
                                <Link to="/search-rooms" className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60">
                                    Search rooms
                                </Link>
                                <Link
                                    to="/saved-requirements"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                                >
                                    Saved requirements
                                </Link>
                                <Link to="/notifications" className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60">
                                    Notifications
                                </Link>
                                <Link to="/profile" className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60">
                                    Profile
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="rounded-md px-3 py-2 text-left text-sm font-medium text-slate-200 hover:bg-slate-700/60"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60">
                                    Login
                                </Link>
                                <Link to="/register" className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700/60">
                                    Register
                                </Link>
                            </>
                        )}

                        <button
                            onClick={toggleTheme}
                            className="rounded-md bg-slate-800/60 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700/70"
                        >
                            {isDark ? (
                                <span className="flex items-center gap-2">
                                    <Sun className="h-4 w-4" /> Light mode
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Moon className="h-4 w-4" /> Dark mode
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
