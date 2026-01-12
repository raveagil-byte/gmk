# System Architecture & Design Document - KurirTrack

## 1. Arsitektur Sistem

Aplikasi menggunakan arsitektur **Client-Server** dengan pendekatan **REST API**.

```mermaid
graph TD
    Client[Mobile App (React Native/Flutter)] -->|HTTPS/JSON| LB[Load Balancer / Nginx]
    LB --> API[Backend API (Node.js/Go/Python)]
    API -->|Read/Write| DB[(PostgreSQL Database)]
    API -->|Logs| Audit[(Audit Logs Table)]
    
    subgraph "External/Internal Services"
        Redis[Redis Cache (Optional for Session/Rate Limit)]
    end
    
    API -.-> Redis
```

**Komponen Utama:**
1.  **Mobile Client**: Frontend aplikasi untuk Kurir, Supervisor, dan Admin. Fokus pada UX cepat dan offline-first capability (jika memungkinkan).
2.  **API Server**: Middleware yang menangani business logic, validasi, RBAC, dan kalkulasi.
3.  **Database**: PostgreSQL sebagai sumber kebenaran data (Single Source of Truth).

## 2. Skema Database (ERD) & Relasi

Menggunakan PostgreSQL.

### Tables

#### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, unique | User ID |
| `username` | VARCHAR(50) | unique, not null | Login username |
| `email` | VARCHAR(100) | unique, not null | Email address |
| `password_hash` | VARCHAR(255) | not null | Bcrypt/Argon2 hash |
| `role` | VARCHAR(20) | not null | ENUM: 'ADMIN', 'SUPERVISOR', 'COURIER' |
| `full_name` | VARCHAR(100) | not null | Real name |
| `created_at` | TIMESTAMPTZ | default NOW() | |
| `updated_at` | TIMESTAMPTZ | default NOW() | |
| `deleted_at` | TIMESTAMPTZ | nullable | Soft delete |

#### `transactions`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, unique | Transaction ID |
| `user_id` | UUID | FK -> users(id) | Kurir yang input |
| `item_count` | INTEGER | not null, > 0 | Jumlah barang |
| `price_per_item` | INTEGER | default 3000 | Locked price |
| `total_value` | INTEGER | not null | item_count * price_per_item |
| `notes` | TEXT | nullable | Catatan tambahan |
| `status` | VARCHAR(20) | default 'DRAFT' | ENUM: 'DRAFT', 'SUBMITTED', 'VERIFIED' |
| `verified_by` | UUID | FK -> users(id) | Supervisor/Admin yang verifikasi |
| `verified_at` | TIMESTAMPTZ | nullable | Waktu verifikasi |
| `created_at` | TIMESTAMPTZ | default NOW() | |
| `updated_at` | TIMESTAMPTZ | default NOW() | |
| `deleted_at` | TIMESTAMPTZ | nullable | Soft delete |

#### `audit_logs`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `user_id` | UUID | FK -> users(id) | Actor who performed action |
| `action` | VARCHAR(50) | not null | CREATE, UPDATE, DELETE, LOGIN, VERIFY |
| `entity_type` | VARCHAR(50) | not null | TRANSACTION, USER |
| `entity_id` | UUID | not null | ID of the affected entity |
| `old_values` | JSONB | nullable | Snapshot before change |
| `new_values` | JSONB | nullable | Snapshot after change |
| `ip_address` | VARCHAR(45) | nullable | |
| `created_at` | TIMESTAMPTZ | default NOW() | |

### Relasi
- `users` 1:N `transactions` (Seorang kurir punya banyak transaksi)
- `users` 1:N `transactions` (sebagai verifikator)
- `users` 1:N `audit_logs`

### Indexing Strategies
1.  `transactions(user_id, created_at)`: Mempercepat query report harian/bulanan per user.
2.  `transactions(created_at)`: Mempercepat global dashboard report.
3.  `transactions(status)`: Filter pending/verified transactions.

## 3. RBAC Flow (Role-Based Access Control)

Sistem menggunakan Middleware Authorization pada setiap endpoint.

*   **ADMIN**:
    *   Access Level: ALL (CRUD User, CRUD Transaksi, View Reports, Audit Logs).
    *   Special Permission: `DELETE_TRANSACTION` (Soft Delete), `MANAGE_USERS`.
*   **SUPERVISOR**:
    *   Access Level: View All Transactions, Verify Transactions.
    *   Restriction: Cannot `DELETE` transactions permanently or manage users.
*   **COURIER**:
    *   Access Level: Create Transaction, View Own Transactions (Read-Only for others/historical).
    *   Restriction: Cannot Change Price, Cannot Verify, Cannot See other couriers' detailed data.

**Flow Otorisasi:**
1.  User Login -> Receive JWT Token (contains `role`).
2.  Request to `POST /transactions` -> Middleware checks `role`.
3.  If `role == COURIER` -> Allow.
4.  Data saved.

## 4. API Endpoints List

### Authentication
- `POST /auth/login` - Login & return JWT
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Invalidate token

### Users (Admin Only)
- `GET /users` - List all users
- `POST /users` - Create user
- `GET /users/:id` - Detail user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user

### Transactions
- `POST /transactions` - Create (Kurir inputs items & notes only. Logic calculates total)
- `GET /transactions` - List (Admin/Spv see all, Kurir sees own. Support filtering by date)
- `GET /transactions/:id` - Detail
- `PUT /transactions/:id` - Update (Only if Draft/Submitted. Verified locked)
- `PUT /transactions/:id/verify` - (Supervisor/Admin only) Verify transaction.
- `DELETE /transactions/:id` - (Admin only) Soft delete.

### Reports
- `GET /reports/dashboard` - Global stats (Total Income, Top Couriers)
- `GET /reports/user/:userId` - Stats for specific user (Daily/Monthly)
- `GET /reports/export` - Download CSV/Excel

### Example API Request/Response

**1. Create Transaction (Kurir Input)**
- **Endpoint**: `POST /transactions`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "itemCount": 50,
    "notes": "Pengiriman area Selatan blok A"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "tx-uuid-123",
      "totalValue": 150000,
      "status": "DRAFT",
      "createdAt": "2023-10-27T10:00:00Z"
    }
  }
  ```

**2. Verify Transaction (Supervisor)**
- **Endpoint**: `PUT /transactions/tx-uuid-123/verify`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "tx-uuid-123",
      "status": "VERIFIED",
      "verifiedBy": "user-uuid-supervisor",
      "verifiedAt": "2023-10-27T12:00:00Z"
    }
  }
  ```

## 5. Logic & Reporting

**Aturan Harga:**
Hardcoded di Backend Config / Constant: `PRICE_PER_ITEM = 3000`.

**Contoh Perhitungan Laporan (JSON Response):**
```json
{
  "period": "2023-10",
  "userId": "uuid-kurir-A",
  "userName": "Budi",
  "summary": {
    "totalItems": 1500,
    "totalTransactions": 50,
    "totalRevenue": 4500000, // 1500 * 3000
    "averageItemsPerTransaction": 30
  },
  "dailyBreakdown": [
    { "date": "2023-10-01", "items": 100, "revenue": 300000 },
    { "date": "2023-10-02", "items": 120, "revenue": 360000 }
  ]
}
```

## 6. Security & Best Practices

1.  **Input Validation**: Gunakan library seperti Joi/Zod di backend. Pastikan `item_count` adalah Integer positif.
2.  **Immutability**: Kolom `price_per_item` disimpan di setiap row transaksi snapshot agar jika harga naik di masa depan, data history tidak berubah. Saat insert `price_per_item` diambil dari config server, bukan input client.
3.  **Audit**: Setiap kali status berubah (Draft -> Verified), catat di `audit_logs`.
4.  **Rate Limiting**: Batasi input transaksi (misal: max 1 per 10 detik) untuk mencegah double-posting tidak sengaja.
5.  **Environment Variables**: Simpan config DB, JWT Secret di `.env` file, jangan di code.
