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

export interface SalesOrder {
  id: number;
  orderId: string;
  customerName?: string;
  customerAddress: string;
  postalCode: string;
  customerContactNo: string;
  customerEmail?: string;
  platformType: PlatformType;
  createdTime: Date;
  currency: string;
  amount: number;
  orderStatus: OrderStatus;
  customerRemarks?: string;
  salesOrderItems: SalesOrderItem[];
}
export interface SalesOrderItem {
  id: number;
  salesOrderId: number;
  price: number;
  quantity: number;
  productName?: string;
  createdTime?: Date;
  isNewAdded?: boolean;
  salesOrderBundleItems: SalesOrderBundleItem[];
}

export interface SalesOrderBundleItem {
  id?: number;
  salesOrderItemId?: number;
  productName: string;
  quantity: number;
  isNewAdded?: boolean;
}

export enum PlatformType {
  LAZADA = 'LAZADA',
  REDMART = 'REDMART',
  SHOPIFY = 'SHOPIFY',
  SHOPEE = 'SHOPEE',
  OTHERS = 'OTHERS'
}

export enum OrderStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  PREPARED = 'PREPARED',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}
