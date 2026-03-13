import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen premium-gradient flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="glass p-10 rounded-3xl shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-sky-500 rounded-2xl mx-auto mb-6 shadow-lg shadow-sky-500/20 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Sign in to manage your engine</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
                                ⚠️ {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-600"
                                placeholder="admin@autogrowth.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-slate-900 font-bold py-4 rounded-2xl transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98] mt-4 relative overflow-hidden group"
                        >
                            <span className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity'}>
                                Sign In
                            </span>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 border-3 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-sm mt-10">
                        Don't have an account? <span className="text-sky-400 font-semibold cursor-pointer hover:underline">Contact Support</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
