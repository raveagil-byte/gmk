
import React, { useState } from 'react';
import { UserRole } from '../types';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; role: UserRole } | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.COURIER] },
    { id: 'transactions', label: 'Transaksi', roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.COURIER] },
    { id: 'users', label: 'Manajemen User', roles: [UserRole.ADMIN] },
    { id: 'reports', label: 'Laporan Detail', roles: [UserRole.ADMIN, UserRole.SUPERVISOR] },
    { id: 'audit', label: 'Audit Log', roles: [UserRole.ADMIN] },
  ];

  const filteredMenuItems = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#EE4D2D] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="font-bold text-lg">GMK</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:relative z-40 w-64 h-full bg-white border-r border-gray-200 text-gray-700 transition-transform duration-300 ease-in-out flex flex-col shadow-sm
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="w-8 h-8 bg-[#EE4D2D] rounded-full flex items-center justify-center text-white shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#EE4D2D]">GMK</h1>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Logistics System</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-colors font-medium text-sm ${activeTab === item.id
                ? 'bg-[#EE4D2D]/10 text-[#EE4D2D] border-l-4 border-[#EE4D2D]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#EE4D2D]'
                }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#EE4D2D]/20 text-[#EE4D2D] flex items-center justify-center text-sm font-bold border border-[#EE4D2D]/10">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full bg-white hover:bg-red-50 text-gray-600 hover:text-[#EE4D2D] py-2 px-4 rounded border border-gray-200 text-sm font-medium transition-colors"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
