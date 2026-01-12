# Implementation Plan - KurirTrack

## Status: Starting

## Phase 1: Backend Foundation (Priority)
- [ ] Initialize `backend` directory (Node.js + TypeScript).
- [ ] Setup **Prisma ORM** with PostgreSQL.
- [ ] Define Database Schema (`User`, `Transaction`, `AuditLog`) in `schema.prisma`.
- [ ] Implement Auth APIs (Login, Register, JWT, RBAC Middleware).
- [ ] Implement Transaction APIs (CRUD, Verification logic).
- [ ] Implement Report APIs.

## Phase 2: Frontend Web (Admin/Dashboard)
- [ ] Refactor existing `App.tsx` (Vite) to use robust State Management (React Query / Context).
- [ ] Replace `mockDb` service with real API calls (`axios`).
- [ ] Ensure Responsive Design for mobile browsers.

## Phase 3: Mobile Native (Kurir App)
- [ ] Initialize React Native (Expo) project in `mobile/` folder.
- [ ] Port "Input Transaksi" and "History" features to Native application.
- [ ] Implement Offline Storage (AsyncStorage) for draft transactions.

## Setup Instructions (For User)
1.  Ensure PostgreSQL is running.
2.  Create database `kurirtrack`.
3.  Update `.env` in `backend/` with DB credentials.
