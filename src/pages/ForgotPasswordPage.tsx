import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending email
        setTimeout(() => {
            setIsSent(true);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter']">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h2 className="text-3xl font-bold text-[#EE4D2D] mb-6">GMK</h2>
                <h2 className="text-2xl font-bold text-gray-900">Lupa Password?</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Masukkan email Anda untuk menerima instruksi reset password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-[#EE4D2D]">
                    {!isSent ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Terdaftar</label>
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
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#EE4D2D] hover:bg-[#D73211] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE4D2D]"
                                >
                                    KIRIM RESET LINK
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Email Terkirim!</h3>
                            <p className="text-sm text-gray-500">
                                Silakan cek inbox/spam email <b>{email}</b>. Kami telah mengirimkan tautan untuk mereset password Anda.
                            </p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-sm text-[#EE4D2D] font-bold hover:underline"
                            >
                                Kirim ulang
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="font-bold text-gray-500 hover:text-gray-900 text-sm">
                            ← Kembali ke Halaman Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
