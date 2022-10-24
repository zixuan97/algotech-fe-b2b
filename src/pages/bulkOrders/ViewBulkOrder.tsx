import React from 'react';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Select,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tooltip,
  Typography
} from 'antd';
import '../../styles/common/common.scss';
import authContext from 'src/context/auth/authContext';
import {
  BulkOrder,
  BulkOrderStatus,
  PaymentMode,
  SalesOrder,
  SalesOrderItem
} from 'src/models/types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  generatePaymentLink,
  getBulkOrderByOrderId
} from 'src/services/bulkOrdersService';
import moment from 'moment';
import { READABLE_DDMMYY_TIME } from 'src/utils/dateUtils';
import { startCase } from 'lodash';
import { CREATE_BULK_ORDER_URL } from 'src/components/routes/routes';
import { redirectToExternal, toCurrencyString } from 'src/utils/utils';
import { AlertType } from 'src/components/common/TimeoutAlert';
import { BOOLEAN_FALSE, BOOLEAN_TRUE } from 'src/utils/constants';

const { Title, Text } = Typography;

const { Option } = Select;

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
  const canceled = searchParams.get('canceled');

  const { isAuthenticated } = React.useContext(authContext);
  const [bulkOrder, setBulkOrder] = React.useState<BulkOrder | null>(null);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [selectedPaymentMode, setSelectedPaymentMode] =
    React.useState<PaymentMode>(PaymentMode.CREDIT_CARD);
  const [bulkOrderLoading, setBulkOrderLoading] =
    React.useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (orderId) {
      setBulkOrderLoading(true);
      asyncFetchCallback(
        getBulkOrderByOrderId(orderId),
        (res) => {
          setBulkOrder(res);
          setSelectedPaymentMode(res.paymentMode);
        },
        () => void 0,
        { updateLoading: setBulkOrderLoading }
      );
    }
  }, [orderId]);

  React.useEffect(() => {
    if (!orderId) {
      return;
    }
    if (success === BOOLEAN_TRUE) {
      setAlert({ message: 'Payment successful!', type: 'success' });
    } else if (
      success === BOOLEAN_FALSE ||
      bulkOrder?.bulkOrderStatus === BulkOrderStatus.PAYMENT_FAILED
    ) {
      setAlert({
        message: 'Payment failed for this order. Click to make payment again.',
        type: 'error'
      });
    } else if (bulkOrder?.bulkOrderStatus === BulkOrderStatus.PAYMENT_PENDING) {
      setAlert({
        message:
          'Payment is pending for this order. Click to make payment again.',
        type: 'warning'
      });
    }
  }, [success, canceled, orderId, bulkOrder]);

  return (
    <div className='container-left' style={{ marginBottom: '2em' }}>
      <Spin size='large' spinning={bulkOrderLoading}>
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
            action={
              alert.type !== 'success' && (
                <Space>
                  <Text>Payment Mode:</Text>
                  <Select
                    style={{ width: '10em' }}
                    value={selectedPaymentMode}
                    onChange={(value) => setSelectedPaymentMode(value)}
                  >
                    {Object.values(PaymentMode).map((paymentMode) => (
                      <Option key={paymentMode} value={paymentMode}>
                        {startCase(paymentMode.toLowerCase())}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    loading={paymentLoading}
                    onClick={() => {
                      if (orderId) {
                        setPaymentLoading(true);
                        asyncFetchCallback(
                          generatePaymentLink({
                            orderId: orderId,
                            paymentMode: selectedPaymentMode
                          }),
                          (res) => redirectToExternal(res.data),
                          () => void 0,
                          { updateLoading: setPaymentLoading }
                        );
                      }
                    }}
                  >
                    Make Payment
                  </Button>
                </Space>
              )
            }
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
      </Spin>
    </div>
  );
};

export default ViewBulkOrder;
