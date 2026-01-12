# GMK - Sistem Logistik & Keuangan Mitra Kurir

**GMK (Logistics System)** adalah aplikasi manajemen operasional yang dirancang khusus untuk mempermudah pencatatan, validasi, dan perhitungan pendapatan harian mitra kurir secara otomatis, aman, dan transparan.

Aplikasi ini menggantikan pencatatan manual (kertas/WhatsApp) dengan sistem digital terpusat yang memiliki standar keamanan audit.

---

## 🌟 Fitur Utama & Kegunaan

### 1. Pencatatan Manifest Digital (Paperless)
*   **Untuk Apa?** Menggantikan laporan manual kurir yang rentan hilang atau salah hitung.
*   **Cara Kerja:** Kurir cukup login -> Pilih "Input Manifest Baru" -> Masukkan jumlah paket.
*   **Keunggulan:** Cepat, mudah, dan data langsung tersimpan di server pusat.

### 2. Kalkulasi Pendapatan Otomatis (Anti-Fraud)
*   **Untuk Apa?** Mencegah kesalahan hitung gaji/insentif kurir.
*   **Cara Kerja:** Sistem otomatis mengalikan jumlah paket dengan Rate Tetap (Rp 3.000/paket).
*   **Keamanan:** Harga ini dikunci di **Backend Server**, sehingga kurir atau admin tidak bisa memanipulasi nominal "harga per paket" sembarangan.

### 3. Role-Based Access Control (RBAC)
Aplikasi membagi akses berdasarkan jabatan:
*   **Kurir**: Hanya bisa input data sendiri & lihat performa sendiri. Tidak bisa lihat data temannya (Privasi).
*   **Supervisor**: Bisa melihat semua data kurir untuk operasional harian & melakukan Verifikasi.
*   **Admin**: Akses penuh, termasuk manajemen user dan penghapusan data (Hapus Data = Soft Delete untuk jejak audit).

### 4. Audit Log System (Jejak Digital)
*   **Untuk Apa?** Kebutuhan audit internal keuangan.
*   **Cara Kerja:** Setiap klik "Simpan", "Verifikasi", atau "Hapus" tercatat detailnya: *Siapa yang melakukan? Kapan? Data apa yang berubah?*
*   **Hasil:** Tidak ada lagi istilah "data hilang misterius" atau "diubah diam-diam".

### 5. Dashboard Analitik Real-Time
*   **Untuk Apa?** Memantau performa operasional.
*   **Fitur:**
    *   Grafik Tren Pengiriman 7 Hari Terakhir.
    *   Top Performers (Ranking Kurir Terrajin).
    *   Rekap Total Pendapatan Harian/Bulanan secara instan.

---

## 🎯 Manfaat Bisnis
1.  **Efisiensi Waktu:** Admin finance tidak perlu merekap ulang chat WhatsApp satu per satu.
2.  **Transparansi:** Kurir bisa melihat estimasi pendapatannya sendiri setiap saat.
3.  **Keamanan Data:** Mencegah kecurangan "tembak data" atau manipulasi tagihan.

---

## 💻 Tech Stack
*   **Frontend**: React (Vite) + Shopee Theme UI.
*   **Backend**: Node.js + Express.
*   **Database**: PostgreSQL.
*   **Security**: JWT Auth, Rate Limiting, Helmet Protection.
