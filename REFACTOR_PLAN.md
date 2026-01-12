# Plan Analisis & Perbaikan Sistem KurirTrack

## 1. Analisis Keamanan & Arsitektur Saat Ini

### Kekurangan:
1.  **Validasi Input**: Validasi hanya mengandalkan pengecekan manual (`if (!itemCount)`), rentan terhadap injeksi atau data tidak valid.
2.  **Struktur Monolith**: Logic, Database Query, dan HTTP Response tercampur di Controller/Model. Perlu pemisahan **Service Layer**.
3.  **Security Headers**: Belum ada perlindungan standar (Helmet) terhadap XSS, Clickjacking, dll.
4.  **Rate Limiting**: API rentan terhadap brute force atau DDoS karena tidak ada pembatasan request.
5.  **Frontend Routing**: Masih menggunakan state manual (`activeTab`), tidak standar (SPA harusnya pakai React Router).
6.  **Error Handling**: Masih menggunakan `try-catch` manual di setiap controller.

## 2. Rekomendasi Perbaikan (Implementation Plan)

### A. Backend Excellence (Node.js)
- [x] **Layered Architecture**: Controller -> Service -> Repository (Model).
- [x] **Zod Validation**: Validasi schema ketat untuk setiap request body.
- [x] **Security Middleware**: Implementasi `helmet` dan `express-rate-limit`.
- [x] **Global Error Handling**: Middleware terpusat untuk menangani error.
- [x] **Logger**: (Opsional) Winston/Morgan untuk logging produksi.

### B. Frontend Modularity (React)
- [x] **React Router DOM**: Mengganti `activeTab` dengan routing URL (`/dashboard`, `/login`, `/transactions`).
- [x] **Context API / Zustand**: State management global untuk Auth.
- [x] **Component Splitting**: Memecah `App.tsx` menjadi pages terpisah.

## 3. Eksekusi Langkah
1.  **Backend**: Install library keamanan & validasi.
2.  **Backend**: Refactor Controller ke Service Pattern.
3.  **Backend**: Tambahkan Global Error Handler.
4.  **Frontend**: Install Router & Refactor struktur folder.
