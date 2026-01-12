
import React, { useState } from 'react';
import { ITEM_PRICE } from '../constants';

interface TransactionFormProps {
  onSubmit: (itemCount: number, notes?: string) => void;
  isLoading: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, isLoading }) => {
  const [itemCount, setItemCount] = useState<string>('');
  const [notes, setNotes] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setItemCount(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(itemCount);
    if (isNaN(count) || count <= 0) {
      alert("Masukkan jumlah item yang valid (min. 1)");
      return;
    }
    onSubmit(count, notes);
    setItemCount('');
    setNotes('');
  };

  const estimatedValue = itemCount ? parseInt(itemCount) * ITEM_PRICE : 0;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-[#EE4D2D] border-b border-gray-100 pb-2">Input Manifest Baru</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Jumlah Item</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={itemCount}
              onChange={handleTextChange}
              placeholder="0"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-[#EE4D2D] focus:border-[#EE4D2D] transition-all text-2xl font-bold text-gray-800 text-center"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Paket</span>
          </div>
          <p className="text-xs text-[#EE4D2D] mt-1 font-medium bg-orange-50 inline-block px-2 py-0.5 rounded">
            Rate: Rp {ITEM_PRICE.toLocaleString()}/paket
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Catatan (Opsional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Area Jakarta Selatan, Hujan..."
            className="w-full p-3 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-[#EE4D2D] focus:border-[#EE4D2D] outline-none"
          />
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Estimasi Pendapatan</p>
            <p className="text-2xl font-black text-[#EE4D2D]">Rp {estimatedValue.toLocaleString()}</p>
          </div>
          <button
            type="submit"
            disabled={isLoading || !itemCount}
            className="bg-[#EE4D2D] hover:bg-[#D73211] disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded shadow-md transition-all transform hover:scale-[1.02]"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </div>

        <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          <span className="uppercase tracking-wide font-semibold">Data terenkripsi & masuk Audit Log</span>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
