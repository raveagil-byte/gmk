-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'COURIER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  courier_id UUID NOT NULL REFERENCES users(id),
  item_count INTEGER NOT NULL,
  price_per_item INTEGER DEFAULT 3000,
  total_value INTEGER NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'DRAFT',
  verified_by_id UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(255) NOT NULL,
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
