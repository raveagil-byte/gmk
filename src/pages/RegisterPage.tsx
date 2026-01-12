import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/apiService';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Password tidak sama');
            return;
        }

        setIsLoading(true);

        try {
            // Simulated registration call - in a real app, you'd have a specific register endpoint
            // For now, we'll assume the same login endpoint handles "auto-register" for demo, 
            // OR we'll just fail if the backend doesn't support public registration yet.
            // But based on previous context, we might not have a public /register endpoint active in userController without auth.
            // So I might need to add a public registration endpoint to the backend first.
            // Wait, looking at apiService, authService.login has some auto-register logic for specific demo emails, 
            // but we want real registration.

            // Let's check authRoutes.ts... oh wait I can't check it right now without a tool.
            // But usually I put register in authController.

            // Assuming /auth/register exists (it was mentioned in apiService comments fallback)

            // I'll assume we need to call a registration endpoint. 
            // If it doesn't exist, I'll have to create it in the backend too.
            // Let's try to hit a new method in authService.

            await authService.register(email, password, name);
            alert("Pendaftaran berhasil! Silakan login.");
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mendaftar. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter']">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-[#EE4D2D] rounded flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#EE4D2D]">GMK</h2>
                </div>
                <h2 className="text-center text-2xl font-bold text-gray-900">Daftar Mitra Kurir Baru</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-[#EE4D2D]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#EE4D2D] focus:border-[#EE4D2D]"
                                placeholder="Cth: Budi Santoso"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#EE4D2D] focus:border-[#EE4D2D]"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#EE4D2D] focus:border-[#EE4D2D]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#EE4D2D] focus:border-[#EE4D2D]"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#EE4D2D] hover:bg-[#D73211] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE4D2D]"
                            >
                                {isLoading ? 'Memproses...' : 'DAFTAR SEKARANG'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Sudah punya akun?{' '}
                            <Link to="/login" className="font-bold text-[#EE4D2D] hover:text-[#D73211]">
                                Login di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
