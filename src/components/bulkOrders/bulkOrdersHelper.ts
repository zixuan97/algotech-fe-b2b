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
import {
  MsgTmpl,
  MSG_TMPL_VAR_SYMBOL
} from './createBulkOrder/MessageTemplate';

export interface HamperOrdersFormItem {
  customerName: string;
  customerContactNo: string;
  hamperId: string;
  customerAddress: string;
  postalCode: string;
  [msgVar: string]: string;
}

export interface Hamper {
  id: string;
  hamperName: string;
  hamperItems: SalesOrderItem[];
  isNewAdded?: boolean;
}

export const convertHamperOrderToSalesOrder = (
  hamperOrder: HamperOrdersFormItem,
  hampersMap: Map<string, Hamper>,
  msgTmpl: MsgTmpl
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
  const customerRemarks = generateMsgTmpl(hamperOrder, msgTmpl);
  return {
    customerName,
    customerAddress,
    postalCode,
    customerContactNo,
    customerRemarks,
    currency: 'SGD',
    amount,
    platformType: PlatformType.B2B,
    orderStatus: OrderStatus.CREATED,
    salesOrderItems
  };
};

export const generateMsgTmpl = (
  hamperOrder: HamperOrdersFormItem,
  msgTmpl: MsgTmpl
): string | undefined => {
  const { tmpl, varSymbolCount } = msgTmpl;
  if (!tmpl) return undefined;
  if (tmpl && varSymbolCount === 0) return tmpl;

  let interpolatedTmpl = tmpl;
  for (let i = 1; i <= varSymbolCount; i++) {
    interpolatedTmpl = interpolatedTmpl.replace(
      MSG_TMPL_VAR_SYMBOL,
      hamperOrder[`msgVar${i}`]
    );
  }
  return interpolatedTmpl;
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
      hampersMap.set(newHamper.id, newHamper);
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
  msgTmpl: MsgTmpl,
  user?: User | null
): BulkOrder => {
  const salesOrders: SalesOrder[] = values.hamperOrdersList.map(
    (hamperOrder: HamperOrdersFormItem) =>
      convertHamperOrderToSalesOrder(hamperOrder, hampersMap, msgTmpl)
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
