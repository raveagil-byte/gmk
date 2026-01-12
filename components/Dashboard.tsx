
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Transaction, UserRole } from '../types';
import { ITEM_PRICE } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  role: UserRole;
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, role, userName }) => {
  const stats = useMemo(() => {
    const totalItems = transactions.reduce((acc, t) => acc + t.itemCount, 0);
    const totalValue = transactions.reduce((acc, t) => acc + t.totalValue, 0);
    const totalTx = transactions.length;

    // Group by day for chart
    const dailyData: Record<string, { date: string; items: number; value: number }> = {};
    transactions.forEach(t => {
      const date = new Date(t.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      if (!dailyData[date]) dailyData[date] = { date, items: 0, value: 0 };
      dailyData[date].items += t.itemCount;
      dailyData[date].value += t.totalValue;
    });

    return {
      totalItems,
      totalValue,
      totalTx,
      avgItems: totalTx > 0 ? (totalItems / totalTx).toFixed(1) : 0,
      chartData: Object.values(dailyData).reverse().slice(0, 7)
    };
  }, [transactions]);

  const topCouriers = useMemo(() => {
    const groups: Record<string, number> = {};
    transactions.forEach(t => {
      groups[t.courierName] = (groups[t.courierName] || 0) + t.itemCount;
    });
    return Object.entries(groups)
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => b.items - a.items)
      .slice(0, 5);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Selamat Datang, {userName}</h2>
        <p className="text-slate-500">Rekapan {role === UserRole.COURIER ? 'Pribadi' : 'Global'} Operasional</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Paket</p>
          <h3 className="text-3xl font-black text-gray-800 mt-2">{stats.totalItems.toLocaleString()}</h3>
          <p className="text-xs text-[#EE4D2D] font-medium mt-1">Seluruh Periode</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Pendapatan</p>
          <h3 className="text-3xl font-black text-[#EE4D2D] mt-2">Rp {stats.totalValue.toLocaleString()}</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Estimasi @Rp{ITEM_PRICE}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Manifest</p>
          <h3 className="text-3xl font-black text-gray-800 mt-2">{stats.totalTx.toLocaleString()}</h3>
          <p className="text-xs text-gray-400 mt-1">Lembar Kerja</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Rata-rata</p>
          <h3 className="text-3xl font-black text-gray-800 mt-2">{stats.avgItems}</h3>
          <p className="text-xs text-gray-400 mt-1">Paket / Manifest</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm h-80">
          <h4 className="text-lg font-bold mb-4 text-gray-800">Tren Pengiriman</h4>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="items" stroke="#EE4D2D" strokeWidth={3} dot={{ r: 4, fill: '#EE4D2D' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Courier Ranking / Detailed View */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm h-80">
          <h4 className="text-lg font-bold mb-4 text-gray-800">
            {role === UserRole.COURIER ? 'Status Performa' : 'Top Kurir'}
          </h4>
          {role !== UserRole.COURIER ? (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={topCouriers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={90} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#fff7ed' }} />
                <Bar dataKey="items" fill="#EE4D2D" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-[#EE4D2D]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h5 className="font-bold text-gray-800">Performa Baik!</h5>
              <p className="text-sm text-slate-500">Terus pertahankan konsistensi pengiriman harian Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
