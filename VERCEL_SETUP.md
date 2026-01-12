# Panduan Deployment ke Vercel

Berikut adalah langkah-langkah untuk mendeploy aplikasi GMK ini ke Vercel (Frontend & Backend dalam satu repo).

## 1. Persiapan
Pastikan Anda sudah memiliki akun [Vercel](https://vercel.com) dan terhubung dengan GitHub.

## 2. Struktur Project (Otomatis)
Saya telah menyiapkan struktur agar Vercel bisa mengenali Frontend dan Backend sekaligus:
*   `vercel.json`: Mengatur routing agar request ke `/api/*` diarahkan ke Backend.
*   `api/index.ts`: Jembatan ("Bridge") agar Express.js backend bisa berjalan di Vercel Serverless Functions.

## 3. Langkah Deployment

### Opsi A: Melalui Vercel Dashboard (Mudah)
1.  Buka Dashboard Vercel -> "Add New Project".
2.  Import Repository GitHub `gmk` Anda.
3.  **Configure Project**:
    *   **Framework Preset**: Pilih `Vite` (Sistem akan mendeteksi otomatis).
    *   **Root Directory**: Biarkan `./` (default).
    *   **Environment Variables**: Masukkan variabel dari `.env` backend Anda:
        *   `DATABASE_URL`: (Isi dengan URL Supabase tadi)
        *   `JWT_SECRET`: (Isi password rahasia bebas)
4.  Klik **Deploy**.

### Opsi B: Melalui Terminal (CLI)
Jika Anda menginstal Vercel CLI (`npm i -g vercel`), jalankan perintah ini di terminal project:

```bash
vercel
```

Ikuti instruksi di layar (pilih default settings).

## 4. Troubleshooting
Jika deploy sukses tapi backend error:
1.  Pastikan **Environment Variables** sudah diisi di menu Settings > Environment Variables di dashboard Vercel.
2.  Backend berjalan secara "Serverless", jadi pastikan koneksi database (Supabase) mendukung koneksi dari IP Vercel (Supabase defaultnya Allow All, jadi aman).

## 5. Domain
Jika sudah dideploy, Anda akan mendapatkan URL seperti `https://gmk-logistics.vercel.app`. Aplikasi siap digunakan!
