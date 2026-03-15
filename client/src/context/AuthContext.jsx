import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setAuthToken(token);
        } else {
            localStorage.removeItem('token');
            setAuthToken(null);
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            // Only persist a minimal safe subset of user info
            const safeUser = {
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin,
            };
            localStorage.setItem('user', JSON.stringify(safeUser));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setUser(data.user || null);
                } else {
                    console.warn('Failed to refresh profile', data);
                }
            } catch (err) {
                console.warn('Error fetching profile:', err);
                // Keep existing user if profile refresh fails (prevents losing session state)
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const value = useMemo(
        () => ({
            token,
            user,
            loading,
            setToken,
            setUser,
            clearToken: () => setToken(null),
        }),
        [token, user, loading]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
}
