import { ColumnsType } from 'antd/lib/table';
import { OrderStatus, PlatformType, SalesOrder } from '../../models/types';

export const columns: ColumnsType<SalesOrder> = [
  {
    title: 'Ordered On',
    dataIndex: 'createdTime',
    key: 'createdTime'
  },
  {
    title: 'Amount ($)',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: 'Order Status',
    dataIndex: 'orderStatus',
    key: 'orderStatus'
  },
  {
    title: 'Shipment Address',
    dataIndex: 'customerAddress',
    key: 'customerAddress'
  },
  {
    title: 'Action',
    key: 'action',
    render: () => 'View'
  }
];

export const data: SalesOrder[] = [
  {
    id: 1,
    orderId: 'LAZ001',
    customerName: 'Peter Tan',
    customerAddress: 'Blk 123 NUS Road',
    postalCode: '123456',
    customerContactNo: '88889999',
    customerEmail: 'petertan@email.com',
    platformType: PlatformType.LAZADA,
    createdTime: new Date(),
    currency: 'SGD',
    amount: 50,
    orderStatus: OrderStatus.DELIVERED,
    customerRemarks: 'No Spicy Thanks',
    salesOrderItems: []
  },
  {
    id: 2,
    orderId: 'SHOPEE001',
    customerName: 'Peter Tan',
    customerAddress: 'Blk 123 NUS Road',
    postalCode: '123456',
    customerContactNo: '88889999',
    customerEmail: 'petertan@email.com',
    platformType: PlatformType.SHOPEE,
    createdTime: new Date(),
    currency: 'SGD',
    amount: 85,
    orderStatus: OrderStatus.SHIPPED,
    customerRemarks: 'All spicy only',
    salesOrderItems: []
  }
];
