import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email);
            navigate('/dashboard');
        } catch (err) {
            setError("Login gagal. Pastikan email/password benar.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] flex items-center justify-center p-4 font-['Inter']">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-[#EE4D2D] rounded-full flex items-center justify-center mb-4 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#EE4D2D]">GMK</h1>
                    <p className="text-gray-500 text-sm mt-1">Sistem Logistik Mitra Kurir</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded focus:ring-[2px] focus:ring-[#EE4D2D] focus:border-[#EE4D2D] outline-none transition-all placeholder:text-gray-400"
                            placeholder="Email / No. Handphone"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded focus:ring-[2px] focus:ring-[#EE4D2D] focus:border-[#EE4D2D] outline-none transition-all placeholder:text-gray-400"
                            placeholder="Password"
                        />
                    </div>
                    {error && <p className="text-[#EE4D2D] text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#EE4D2D] hover:bg-[#D73211] text-white font-medium py-3 rounded shadow-md transition-all transform hover:scale-[1.01] disabled:opacity-70"
                    >
                        {isLoading ? 'Memuat...' : 'Log In'}
                    </button>
                    <div className="flex justify-between text-xs text-gray-500 mt-4">
                        <a href="#" className="hover:text-[#EE4D2D]">Lupa Password?</a>
                        <a href="#" className="hover:text-[#EE4D2D]">Daftar Mitra Baru</a>
                    </div>
                </form>
            </div>
        </div>
    );
};
