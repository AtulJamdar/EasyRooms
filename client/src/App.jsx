import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MatchesPage from './pages/MatchesPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PostRoomPage from './pages/PostRoomPage';
import SearchRoomsPage from './pages/SearchRoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import MyPostsPage from './pages/MyPostsPage';
import SavedRequirementsPage from './pages/SavedRequirementsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ContactPage from './pages/ContactPage';
import UserRoomsPage from './pages/UserRoomsPage';
import api, { setAuthToken } from './services/api';

function ProtectedRoute({ children }) {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function AdminRoute({ children }) {
    const { token } = useAuth();
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        if (!token) return;
        setAuthToken(token);

        (async () => {
            try {
                const res = await api.get('/auth/profile');
                setIsAdmin(res.data?.user?.role === 'admin');
            } catch (err) {
                console.warn('AdminRoute profile fetch failed:', err?.response?.status, err?.response?.data);
                setIsAdmin(false);
            }
        })();
    }, [token]);

    if (!token) return <Navigate to="/login" replace />;
    if (isAdmin === null) return null;
    if (!isAdmin) return <Navigate to="/matches" replace />;

    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route
                    path="/matches"
                    element={
                        <ProtectedRoute>
                            <MatchesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/post-room"
                    element={
                        <ProtectedRoute>
                            <PostRoomPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-posts"
                    element={
                        <ProtectedRoute>
                            <MyPostsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search-rooms"
                    element={
                        <ProtectedRoute>
                            <SearchRoomsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/rooms/:id"
                    element={
                        <ProtectedRoute>
                            <RoomDetailPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users/:id/rooms"
                    element={
                        <ProtectedRoute>
                            <UserRoomsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/saved-requirements"
                    element={
                        <ProtectedRoute>
                            <SavedRequirementsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <NotificationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboardPage />
                        </AdminRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}
