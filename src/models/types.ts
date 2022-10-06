export interface User {
  id: number;
  email: string;
}

export enum UserRole {
  DISTRIBUTOR = 'DISTRIBUTOR', 
  CORPORATE = 'CORPORATE'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
}
