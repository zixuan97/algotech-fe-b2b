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
  id?: number;
  orderId?: string;
  customerName?: string;
  customerAddress: string;
  postalCode: string;
  customerContactNo: string;
  customerEmail?: string;
  platformType: PlatformType;
  createdTime?: Date;
  currency: string;
  amount: number;
  orderStatus: OrderStatus;
  customerRemarks?: string;
  salesOrderItems: SalesOrderItem[];
}
export interface SalesOrderItem {
  id?: number;
  salesOrderId?: number;
  price: number;
  quantity: number;
  productName: string;
  createdTime?: Date;
  isNewAdded?: boolean;
  salesOrderBundleItems?: SalesOrderBundleItem[];
}

export interface SalesOrderBundleItem {
  id?: number;
  salesOrderItemId?: number;
  productName: string;
  quantity: number;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  image?: string;
  qtyThreshold: number;
  brandId: number;
}

export interface Bundle {
  id: number;
  name: string;
  description: string;
  bundleProduct: BundleProduct[];
}

export interface BundleProduct {
  product: Product;
  productId: number;
  quantity: number;
}

export interface ProductCatalogue {
  id: number;
  price: number;
  image: string;
  productId: number;
  product: Product;
}

export interface BundleCatalogue {
  id: number;
  price: number;
  image: string;
  bundleId: number;
  bundle: Bundle;
}

export interface BulkOrder {
  id?: number;
  amount: number;
  paymentMode: PaymentMode;
  payeeName: string;
  payeeEmail: string;
  payeeContactNo: string;
  payeeRemarks?: string;
  bulkOrderStatus: BulkOrderStatus;
  salesOrders: SalesOrder[];
}

export enum PlatformType {
  LAZADA = 'LAZADA',
  REDMART = 'REDMART',
  SHOPIFY = 'SHOPIFY',
  SHOPEE = 'SHOPEE',
  B2B = 'B2B',
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

export enum PaymentMode {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYNOW = 'PAYNOW'
}

export enum BulkOrderStatus {
  CREATED = 'CREATED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED'
}
