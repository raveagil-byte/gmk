# KurirTrack - Sistem Logistik & Keuangan

Aplikasi pencatatan barang kiriman kurir dengan kalkulasi otomatis dan audit log.

## Arsitektur

- **Frontend**: React + Vite (Port 5173/5174)
- **Backend**: Node.js + Express + TypeScript (Port 3000)
- **Database**: PostgreSQL (via `pg` driver)

## Cara Menjalankan

### 1. Database
Pastikan PostgreSQL berjalan dan database `kurirtrack` sudah dibuat.
```sql
CREATE DATABASE kurirtrack;
```
*(Schema akan dibuat otomatis saat backend start pertama kali melalui `scripts/migrate.ts`)*

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
Server akan berjalan di `http://localhost:3000`.
- **Admin**: admin@kurirtrack.com / admin
- **Kurir**: andi@kurirtrack.com / password

### 3. Frontend
```bash
# Di terminal baru
npm install
npm run dev
```
Aplikasi web akan berjalan di `http://localhost:5173`.

## Fitur Utama

- **Role-Based Access Control (RBAC)**: Admin, Supervisor, Kurir.
- **Kalkulasi Otomatis**: Harga per item (Rp 3.000) dihitung di server.
- **Audit Log**: Setiap perubahan status transaksi tercatat.
- **Laporan**: Dashboard real-time pendapatan dan performa kurir.

## API Endpoints

- `POST /auth/login`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id/verify`
