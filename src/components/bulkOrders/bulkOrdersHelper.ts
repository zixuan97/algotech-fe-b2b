import {
  OrderStatus,
  PlatformType,
  SalesOrder,
  SalesOrderItem
} from '../../models/types';

export interface HamperOrdersFormItem {
  customerName: string;
  customerContactNo: string;
  hamper: SalesOrderItem[];
  customerAddress: string;
  quantity: number;
  postalCode: string;
}

export const convertHamperOrderToSalesOrder = (
  hamperOrder: HamperOrdersFormItem
): SalesOrder => {
  const {
    customerName,
    customerContactNo,
    customerAddress,
    postalCode,
    quantity,
    hamper
  } = hamperOrder;
  const salesOrderItems = hamper.map((salesOrderItem) => ({
    ...salesOrderItem,
    quantity: salesOrderItem.quantity * quantity
  }));
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
    platformType: PlatformType.OTHERS,
    orderStatus: OrderStatus.CREATED,
    salesOrderItems
  };
};
