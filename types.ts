
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  COURIER = 'COURIER'
}

export enum TransactionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  VERIFIED = 'VERIFIED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  deletedAt?: string | null;
}

export interface Transaction {
  id: string;
  courierId: string;
  courierName: string;
  itemCount: number;
  totalValue: number; // calculated as itemCount * 3000
  notes?: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface AuditLog {
  id: string;
  transactionId: string;
  userId: string;
  action: string;
  oldData?: string;
  newData?: string;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
