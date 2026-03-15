import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const { setToken, setUser } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await api.post('/auth/register', data);
            const token = res.data.token;
            setAuthToken(token);
            setToken(token);
            setUser(res.data.user);
            navigate('/matches');
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-indigo-100 text-slate-900 dark:from-slate-900 dark:to-indigo-950 dark:text-white">
            <div className="w-full max-w-md p-8 bg-white/80 dark:bg-slate-900/70 rounded-xl shadow-lg">
                <h1 className="text-2xl font-semibold mb-6">Create an account</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                            <p className="text-xs text-pink-300 mt-1">{errors.name.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && (
                            <p className="text-xs text-pink-300 mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                        />
                        {errors.password && (
                            <p className="text-xs text-pink-300 mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-300">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-200 hover:text-white">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
