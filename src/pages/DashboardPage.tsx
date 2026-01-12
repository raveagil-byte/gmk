import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../../components/Layout';
import Dashboard from '../../components/Dashboard';
import TransactionForm from '../../components/TransactionForm';
import { transactionService, userService, auditService } from '../../services/apiService';
import { Transaction, User, AuditLog, UserRole, TransactionStatus } from '../../types';

export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [users, setUsers] = useState<User[]>([]); // To do: Fetch real users
    const [logs, setLogs] = useState<AuditLog[]>([]); // To do: Fetch real logs
    const [loading, setLoading] = useState(false);

    const refreshData = async () => {
        try {
            const txs = await transactionService.getAll();
            setTransactions(txs);

            // Fetch extra data if Admin
            if (user?.role === 'ADMIN') {
                try {
                    const u = await userService.getAll();
                    setUsers(u);
                    const l = await auditService.getAll();
                    setLogs(l);
                } catch (err) {
                    console.error("Failed to fetch admin data", err);
                }
            }
        } catch (e) {
            console.error("Failed to fetch data", e);
        }
    };

    useEffect(() => {
        refreshData();
    }, [user]);

    const handleAddTransaction = async (count: number, notes?: string) => {
        setLoading(true);
        try {
            await transactionService.create(count, notes);
            await refreshData();
            setActiveTab('transactions');
        } catch (err: any) {
            alert(err.message || "Gagal menyimpan transaksi");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id: string) => {
        try {
            await transactionService.verify(id);
            refreshData();
        } catch (err: any) {
            alert("Gagal verifikasi: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteTx = async (id: string) => {
        if (confirm("Hapus transaksi ini? (Soft Delete)")) {
            try {
                await transactionService.delete(id);
                refreshData();
            } catch (err) {
                alert("Gagal hapus");
            }
        }
    };

    if (!user) return null;

    return (
        <Layout user={user} onLogout={logout} activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'dashboard' && (
                <Dashboard transactions={transactions} role={user.role} userName={user.name} />
            )}

            {activeTab === 'transactions' && (
                <div className="space-y-6">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Data Transaksi</h2>
                            <p className="text-gray-500 text-sm">Manifest pengiriman barang harian</p>
                        </div>
                        {user.role === UserRole.COURIER && (
                            <button
                                onClick={() => setActiveTab('new_transaction')}
                                className="bg-[#EE4D2D] text-white px-4 py-2 rounded shadow hover:bg-[#D73211] transition-all flex items-center gap-2 font-medium"
                            >
                                <span>+ Input Manifest Baru</span>
                            </button>
                        )}
                    </header>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Kurir / Waktu</th>
                                        <th className="px-6 py-4 font-semibold">Item</th>
                                        <th className="px-6 py-4 font-semibold">Total</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">Belum ada transaksi</td>
                                        </tr>
                                    ) : (
                                        transactions.map(tx => (
                                            <tr key={tx.id} className="hover:bg-orange-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-800">{tx.courierName}</p>
                                                    <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString('id-ID')}</p>
                                                    {tx.notes && <p className="text-[10px] mt-1 text-[#EE4D2D] bg-orange-50 px-1.5 py-0.5 inline-block rounded font-medium">📝 {tx.notes}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-lg font-semibold text-gray-700">{tx.itemCount}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-[#EE4D2D]">Rp {tx.totalValue.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${tx.status === TransactionStatus.VERIFIED
                                                        ? 'bg-green-50 text-green-600 border-green-100'
                                                        : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                        }`}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {tx.status === TransactionStatus.SUBMITTED && user.role !== UserRole.COURIER && (
                                                            <button
                                                                onClick={() => handleVerify(tx.id)}
                                                                className="bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-sm hover:shadow"
                                                            >
                                                                VERIFIKASI
                                                            </button>
                                                        )}
                                                        {user.role === UserRole.ADMIN && (
                                                            <button
                                                                onClick={() => handleDeleteTx(tx.id)}
                                                                className="bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 text-[10px] font-bold px-3 py-1.5 rounded border border-red-100"
                                                            >
                                                                HAPUS
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'new_transaction' && (
                <div className="max-w-xl mx-auto mt-8">
                    <TransactionForm onSubmit={handleAddTransaction} isLoading={loading} />
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className="mt-6 text-gray-500 hover:text-[#EE4D2D] flex items-center gap-2 font-medium text-sm mx-auto transition-colors"
                    >
                        <span>← Kembali ke Daftar Transaksi</span>
                    </button>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Manajemen User</h2>
                            <p className="text-gray-500 text-sm">Daftar pengguna & hak akses aplikasi</p>
                        </div>
                        <button className="bg-[#EE4D2D] text-white px-4 py-2 rounded shadow text-sm font-bold opacity-50 cursor-not-allowed">
                            + Tambah User (Demo)
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map(u => (
                            <div key={u.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white ${u.role === 'ADMIN' ? 'bg-slate-800' : (u.role === 'SUPERVISOR' ? 'bg-blue-600' : 'bg-[#EE4D2D]')
                                    }`}>
                                    {u.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{u.name}</h4>
                                    <p className="text-xs text-gray-500">{u.email}</p>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1 block">{u.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'audit' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Audit Log System</h2>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden text-sm">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Time</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">User</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Action</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Entity</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Changes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.map((log: any) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {log.userName || log.user_name || 'Unknown'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {log.entityType} #{log.entityId.slice(0, 5)}
                                        </td>
                                        <td className="px-4 py-3 text-xs font-mono text-gray-500 max-w-xs truncate">
                                            {JSON.stringify(log.newValues || {})}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="bg-white p-12 rounded-xl border-2 border-dashed border-gray-200 text-center space-y-4 hover:border-[#EE4D2D]/30 transition-colors">
                    <div className="w-20 h-20 bg-orange-50 rounded-full mx-auto flex items-center justify-center text-[#EE4D2D]">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Ekspor Laporan Operasional</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Generate CSV/Excel untuk rekap harian, mingguan, dan bulanan secara otomatis.</p>
                    <div className="flex justify-center gap-3 pt-2">
                        <button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded shadow text-sm font-bold">Download CSV</button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded shadow text-sm font-bold">Download Excel</button>
                    </div>
                </div>
            )}
        </Layout>
    );
};
