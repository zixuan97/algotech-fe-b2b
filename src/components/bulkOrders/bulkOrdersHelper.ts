import {
  BundleCatalogue,
  OrderStatus,
  PlatformType,
  ProductCatalogue,
  SalesOrder,
  SalesOrderItem
} from '../../models/types';

export interface HamperOrdersFormItem {
  customerName: string;
  customerContactNo: string;
  hamperName: string;
  customerAddress: string;
  quantity: number;
  postalCode: string;
}

export interface Hamper {
  id: string;
  hamperName: string;
  hamperItems: SalesOrderItem[];
  isNewAdded?: boolean;
}

export const convertHamperOrderToSalesOrder = (
  hamperOrder: HamperOrdersFormItem,
  hampersMap: Map<string, Hamper>
): SalesOrder => {
  const {
    customerName,
    customerContactNo,
    customerAddress,
    postalCode,
    quantity,
    hamperName
  } = hamperOrder;
  const hamper = hampersMap.get(hamperName);
  const salesOrderItems =
    hamper?.hamperItems.map((salesOrderItem) => ({
      ...salesOrderItem,
      quantity: salesOrderItem.quantity * quantity
    })) ?? [];
  const amount = salesOrderItems.reduce(
    (prev, curr) => prev + curr.quantity * curr.price,
    0
  );
  return {
    customerName,
    customerAddress,
    postalCode,
    customerContactNo,
    currency: 'SGD',
    amount,
    platformType: PlatformType.B2B,
    orderStatus: OrderStatus.CREATED,
    salesOrderItems
  };
};

export const convertCatalogueToSalesOrderItem = (
  catalogue: ProductCatalogue | BundleCatalogue,
  quantity: number
): SalesOrderItem => {
  const { price } = catalogue;
  const productName =
    (catalogue as ProductCatalogue).product?.name ??
    (catalogue as BundleCatalogue).bundle?.name;
  return {
    productName,
    price,
    quantity
  };
};

export const isHamperEmpty = (hamper: Hamper): boolean =>
  !(hamper.hamperItems.length > 0 && hamper.hamperName);

export const checkDuplicateHamperName = (
  hampers: Hamper[],
  hamperName: string
): boolean =>
  !!hampers.find(
    (hamper) => hamper.hamperName === hamperName && hamper.isNewAdded
  );

export const calculateSalesOrderAmt = (
  salesOrderItems: SalesOrderItem[]
): number =>
  salesOrderItems.reduce((prev, curr) => prev + curr.price * curr.quantity, 0);

export const calculateBulkOrderAmt = (salesOrders: SalesOrder[]): number =>
  salesOrders.reduce((prev, curr) => prev + curr.amount, 0);

export const hasValidHampers = (hampers: Hamper[]) =>
  hampers.length > 0 && !hampers.some((hamper) => isHamperEmpty(hamper));
