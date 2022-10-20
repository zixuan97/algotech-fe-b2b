import React from 'react';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Space,
  Table,
  TableColumnsType,
  Tooltip,
  Typography
} from 'antd';
import '../../styles/common/common.scss';
import authContext from 'src/context/auth/authContext';
import { BulkOrder, SalesOrder, SalesOrderItem } from 'src/models/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getBulkOrderByOrderId } from 'src/services/bulkOrdersService';
import moment from 'moment';
import { READABLE_DDMMYY_TIME } from 'src/utils/dateUtils';
import { startCase } from 'lodash';
import { CREATE_BULK_ORDER_URL } from 'src/components/routes/routes';
import { toCurrencyString } from 'src/utils/utils';
import { AlertType } from 'src/components/common/TimeoutAlert';

const { Title } = Typography;

// TODO: format col widths
const columns: TableColumnsType<SalesOrder> = [
  {
    title: 'Customer Name',
    dataIndex: 'customerName'
  },
  {
    title: 'Contact No.',
    dataIndex: 'customerContactNo'
  },
  {
    title: 'Address',
    dataIndex: 'customerAddress'
  },
  {
    title: 'Postal Code',
    dataIndex: 'postalCode'
  },
  {
    title: 'Message',
    dataIndex: 'customerRemarks'
  },
  {
    title: 'Order Amount',
    dataIndex: 'amount',
    align: 'right',
    render: (value) => toCurrencyString(value)
  }
];

const orderItemsColumns: TableColumnsType<SalesOrderItem> = [
  {
    title: 'Item Name',
    dataIndex: 'productName',
    width: '50%'
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity'
  },
  {
    title: 'Price per Unit',
    dataIndex: 'price',
    align: 'right',
    render: (value) => toCurrencyString(value)
  },
  {
    title: 'Total Price',
    align: 'right',
    render: (_, record) => toCurrencyString(record.quantity * record.price)
  }
];

type OrderItemsTableProps = {
  salesOrderItems: SalesOrderItem[];
};

const OrderItemsTable = ({ salesOrderItems }: OrderItemsTableProps) => {
  return (
    <Table
      rowKey={(record) => record.productName}
      columns={orderItemsColumns}
      dataSource={salesOrderItems}
      pagination={false}
    />
  );
};

const ViewBulkOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const success = searchParams.get('success');

  const { isAuthenticated } = React.useContext(authContext);
  const [bulkOrder, setBulkOrder] = React.useState<BulkOrder | null>(null);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  React.useEffect(() => {
    if (orderId) {
      asyncFetchCallback(getBulkOrderByOrderId(orderId), setBulkOrder);
    }
  }, [orderId]);

  React.useEffect(() => {
    if (success) {
      setAlert({ message: 'Payment successful!', type: 'success' });
      setTimeout(() => setAlert(null), 5000);
    } else {
      setAlert({
        message: 'Payment failed for this order. Click to try again.',
        type: 'error'
      });
    }
  }, [success]);

  return (
    <div className='container-left' style={{ marginBottom: '2em' }}>
      <div className='container-spaced-out' style={{ marginBottom: '1em' }}>
        <Title level={2}>View Bulk Order</Title>
        <Tooltip
          title='Create a new order with the same details'
          placement='bottomLeft'
          mouseEnterDelay={0.8}
        >
          <Button
            type='primary'
            disabled={!orderId || !bulkOrder}
            onClick={() => {
              if (orderId) {
                navigate(CREATE_BULK_ORDER_URL, {
                  state: { orderId: orderId }
                });
              }
            }}
          >
            Reorder
          </Button>
        </Tooltip>
      </div>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          showIcon
          style={{ marginBottom: '1em' }}
          action={alert.type === 'error' && <Button>Make Payment</Button>}
        />
      )}
      <Space direction='vertical' style={{ width: '100%' }}>
        {!isAuthenticated && (
          <Card style={{ marginBottom: '1em' }}>
            <Descriptions title='Payee Details'>
              <Descriptions.Item label='Name'>
                {bulkOrder?.payeeName}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>
                {bulkOrder?.payeeEmail}
              </Descriptions.Item>
              <Descriptions.Item label='Contact No.'>
                {bulkOrder?.payeeContactNo}
              </Descriptions.Item>
              {bulkOrder?.payeeCompany && (
                <Descriptions.Item label='Company'>
                  {bulkOrder.payeeCompany}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
        <Card style={{ marginBottom: '1em' }}>
          <Descriptions title='Order Details'>
            <Descriptions.Item label='Order ID'>
              {bulkOrder?.orderId}
            </Descriptions.Item>
            <Descriptions.Item label='Created On'>
              {bulkOrder?.createdTime &&
                moment(bulkOrder.createdTime).format(READABLE_DDMMYY_TIME)}
            </Descriptions.Item>
            <Descriptions.Item label='Order Status'>
              {bulkOrder?.bulkOrderStatus}
            </Descriptions.Item>
            <Descriptions.Item label='Order Total'>
              {bulkOrder?.amount && toCurrencyString(bulkOrder.amount)}
            </Descriptions.Item>
            <Descriptions.Item label='Payment Mode'>
              {startCase(bulkOrder?.paymentMode.toLowerCase())}
            </Descriptions.Item>
            <Descriptions.Item label='Order Remarks'>
              {bulkOrder?.payeeRemarks}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Title level={4}>Sales Orders</Title>
        <Table
          rowKey={(record) => record.orderId!}
          columns={columns}
          dataSource={bulkOrder?.salesOrders ?? []}
          expandable={{
            expandedRowRender: (record) => (
              <OrderItemsTable salesOrderItems={record.salesOrderItems} />
            )
          }}
        />
      </Space>
    </div>
  );
};

export default ViewBulkOrder;
