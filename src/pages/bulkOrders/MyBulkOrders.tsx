import {
  Button,
  DatePicker,
  Space,
  Table,
  TableColumnsType,
  Typography
} from 'antd';
import { startCase } from 'lodash';
import moment from 'moment';
import React from 'react';
import {
  createSearchParams,
  NavigateFunction,
  useNavigate
} from 'react-router-dom';
import { VIEW_BULK_ORDER_URL } from 'src/components/routes/routes';
import authContext from 'src/context/auth/authContext';
import { BulkOrder, SalesOrder, SalesOrderItem } from 'src/models/types';
import { getBulkOrdersByEmail } from 'src/services/bulkOrdersService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { NullableMomentRange, READABLE_DDMMYY_TIME } from 'src/utils/dateUtils';
import { toCurrencyString } from 'src/utils/utils';
import '../../styles/common/common.scss';

const { Title, Text } = Typography;

const { RangePicker } = DatePicker;

const columns = (navigate: NavigateFunction): TableColumnsType<BulkOrder> => [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    width: '10%'
    // key: 'orderId'
  },
  {
    title: 'Created Date',
    dataIndex: 'createdTime',
    render: (value) => moment(value).format(READABLE_DDMMYY_TIME)
    // key: 'orderId'
  },
  {
    title: 'Order Status',
    dataIndex: 'bulkOrderStatus',
    render: (value) => startCase(value.toLowerCase())
    // key: 'orderId'
  },
  {
    title: 'Payment Mode',
    dataIndex: 'paymentMode',
    render: (value) => startCase(value.toLowerCase())
    // key: 'orderId'
  },
  {
    title: 'Order Total',
    dataIndex: 'amount',
    align: 'right',
    render: (value) => toCurrencyString(value)
  },
  {
    title: 'Remarks',
    dataIndex: 'payeeRemarks'
    // key: 'orderId'
  },
  {
    title: 'Action',
    dataIndex: 'orderId',
    render: (value) => (
      <Button
        type='primary'
        onClick={() =>
          navigate({
            pathname: VIEW_BULK_ORDER_URL,
            search: createSearchParams({
              orderId: value
            }).toString()
          })
        }
      >
        View Order
      </Button>
    )
  }
];

const salesOrderColumns: TableColumnsType<SalesOrder> = [
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
    title: 'Order Amount',
    dataIndex: 'amount',
    render: (value) => toCurrencyString(value)
  },
  {
    title: 'Quantity',
    dataIndex: 'salesOrderItems',
    width: '5%',
    // align: 'center',
    render: (value) => (
      <Space direction='vertical'>
        {(value as SalesOrderItem[]).map((salesOrderItem, index) => (
          <Space key={salesOrderItem.id!}>
            {/* <Text>{`${index + 1}.`}</Text> */}
            <Text>{`${salesOrderItem.quantity}`}</Text>
            {/* <Divider type='vertical' style={{ background: '#C5C5C5' }} /> */}
            {/* <Text>{salesOrderItem.productName}</Text> */}
          </Space>
        ))}
      </Space>
    )
  },
  {
    title: 'Order Items',
    dataIndex: 'salesOrderItems',
    width: '30%',
    render: (value) => (
      <Space direction='vertical'>
        {(value as SalesOrderItem[]).map((salesOrderItem, index) => (
          <Space key={salesOrderItem.id!}>
            {/* <Text>{`${index + 1}.`}</Text> */}
            {/* <Text>{`${salesOrderItem.quantity}x`}</Text> */}
            {/* <Divider type='vertical' style={{ background: '#C5C5C5' }} /> */}
            <Text>{salesOrderItem.productName}</Text>
          </Space>
        ))}
      </Space>
    )
  }
];

type SalesOrderTableProps = {
  salesOrders: SalesOrder[];
};

const SalesOrderTable = ({ salesOrders }: SalesOrderTableProps) => {
  return (
    <Table
      rowKey={(record) => record.orderId!}
      columns={salesOrderColumns}
      dataSource={salesOrders}
      pagination={false}
    />
  );
};

const MyBulkOrders = () => {
  const { user } = React.useContext(authContext);
  const [bulkOrders, setBulkOrders] = React.useState<BulkOrder[]>([]);
  const [searchField, setSearchField] = React.useState<string>('');
  const [dateRange, setDateRange] = React.useState<NullableMomentRange>([
    null,
    null
  ]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const filteredData = React.useMemo(
    () =>
      bulkOrders
        .filter((bulkOrder) => {
          const { orderId, bulkOrderStatus, paymentMode, payeeRemarks } =
            bulkOrder;
          const searchFieldLower = searchField.toLowerCase();
          return (
            orderId.includes(searchFieldLower) ||
            bulkOrderStatus.toLowerCase().includes(searchFieldLower) ||
            paymentMode.toLowerCase().includes(searchFieldLower) ||
            payeeRemarks?.toLowerCase().includes(searchFieldLower)
          );
        })
        .filter((bulkOrder) => {
          const { createdTime } = bulkOrder;
          if (!dateRange || !createdTime) return true;
          if (!dateRange[0] && !dateRange[1]) return true;
          if (!dateRange[0] && dateRange[1])
            return dateRange[1].isSameOrAfter(createdTime);
          if (dateRange[0] && !dateRange[1])
            return dateRange[0].isSameOrBefore(createdTime);
          return (
            dateRange[0]!.isSameOrBefore(createdTime) &&
            dateRange[1]!.isSameOrAfter(createdTime)
          );
        }),
    [bulkOrders, searchField, dateRange]
  );

  React.useEffect(() => {
    if (user?.email) {
      setLoading(true);
      asyncFetchCallback(
        getBulkOrdersByEmail(user.email),
        (res) => setBulkOrders(res),
        () => void 0,
        { updateLoading: setLoading }
      );
    }
  }, [user?.email]);

  return (
    <Space size='middle' direction='vertical' style={{ width: '100%' }}>
      <Title level={2}>My Orders</Title>
      {/* <Space size='large' style={{ marginBottom: '0.5em' }}>
        <Space>
          <Text>Search:</Text>
          <Input
            placeholder='Search'
            style={{ width: '25rem' }}
            suffix={<SearchOutlined />}
            onChange={(e) => setSearchField(e.target.value)}
          />
        </Space>
        <Space>
          <Text>Date Filters:</Text>
          <RangePicker
            showTime
            format={READABLE_DDMMYY_TIME}
            value={dateRange}
            onCalendarChange={(dates) => setDateRange(dates)}
          />
        </Space>
      </Space> */}
      <Table
        rowKey={(record) => record.orderId}
        columns={columns(navigate)}
        dataSource={filteredData}
        expandable={{
          expandedRowRender: (record) => (
            <SalesOrderTable salesOrders={record.salesOrders} />
          )
        }}
        loading={loading}
      />
    </Space>
  );
};

export default MyBulkOrders;
