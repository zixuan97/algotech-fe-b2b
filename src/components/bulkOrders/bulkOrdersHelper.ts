import { isEqual } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  BulkOrder,
  BulkOrderStatus,
  BundleCatalogue,
  OrderStatus,
  PlatformType,
  ProductCatalogue,
  SalesOrder,
  SalesOrderItem,
  User
} from '../../models/types';

export interface HamperOrdersFormItem {
  customerName: string;
  customerContactNo: string;
  hamperId: string;
  customerAddress: string;
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
    hamperId
  } = hamperOrder;
  const hamper = hampersMap.get(hamperId);
  const salesOrderItems = hamper?.hamperItems ?? [];
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

export const convertSalesOrderToHamperOrder = (
  salesOrder: SalesOrder,
  hampersMap: Map<string, Hamper>
): HamperOrdersFormItem => {
  const { customerName, customerContactNo, customerAddress, postalCode } =
    salesOrder;
  const hamperId =
    [...hampersMap.values()].find((hamper) =>
      isEqual(hamper.hamperItems, salesOrder.salesOrderItems)
    )?.id ?? '';

  return {
    customerName,
    customerContactNo,
    customerAddress,
    postalCode,
    hamperId
  };
};

export const getHampersMap = (
  salesOrders: SalesOrder[]
): Map<string, Hamper> => {
  const hampersMap = new Map<string, Hamper>();
  let hamperIndex = 1;
  salesOrders.forEach((salesOrder) => {
    const { salesOrderItems } = salesOrder;
    const existingHampers = [...hampersMap.values()];
    if (
      existingHampers.every(
        (hamper) => !isEqual(salesOrderItems, hamper.hamperItems)
      )
    ) {
      const newHamper: Hamper = {
        id: uuidv4(),
        hamperName: `Hamper ${hamperIndex++}`,
        hamperItems: salesOrderItems,
        isNewAdded: false
      };
      hampersMap.set(newHamper.hamperName, newHamper);
    }
  });

  return hampersMap;
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

export const convertFormValuesToBulkOrder = (
  values: any,
  hampersMap: Map<string, Hamper>,
  user?: User | null
): BulkOrder => {
  const salesOrders: SalesOrder[] = values.hamperOrdersList.map(
    (hamperOrder: HamperOrdersFormItem) =>
      convertHamperOrderToSalesOrder(hamperOrder, hampersMap)
  );
  const amount = calculateBulkOrderAmt(salesOrders);
  let payeeDetails = {};
  if (user) {
    //setpayeedetails
  } else {
    payeeDetails = {
      paymentMode: values.paymentMode,
      payeeName: values.payeeName,
      payeeEmail: values.payeeEmail,
      payeeContactNo: values.payeeContactNo,
      payeeCompany: values.payeeCompany
    };
  }
  return {
    amount,
    ...payeeDetails,
    ...(values.payeeRemarks && { payeeRemarks: values.payeeRemarks }),
    bulkOrderStatus: BulkOrderStatus.CREATED,
    salesOrders
  };
};

export const convertBulkOrdersToFormValues = (
  bulkOrder: BulkOrder
): [any, Map<string, Hamper>] => {
  const {
    payeeName,
    payeeContactNo,
    payeeEmail,
    paymentMode,
    payeeCompany,
    payeeRemarks,
    salesOrders
  } = bulkOrder;
  const generatedHampersMap = getHampersMap(salesOrders);
  const hamperOrdersList = salesOrders
    .map((salesOrder) =>
      convertSalesOrderToHamperOrder(salesOrder, generatedHampersMap)
    )
    .filter((hamperOrder) => !!hamperOrder.hamperId);
  const formValues = {
    payeeName,
    payeeContactNo,
    payeeEmail,
    paymentMode,
    payeeCompany,
    ...(payeeRemarks && { payeeRemarks }),
    hamperOrdersList
  };
  return [formValues, generatedHampersMap];
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
