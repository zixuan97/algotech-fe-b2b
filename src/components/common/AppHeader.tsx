import { Image, Layout, Menu, MenuProps, Typography } from 'antd';
import '../../styles/common/appHeader.scss';
import logo from '../../resources/logo-blue.png';
import authContext from '../../context/auth/authContext';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BULK_ORDERS_URL,
  CATALOGUE_URL,
  CREATE_BULK_ORDER_URL,
  LOGIN_URL,
  MY_ACCOUNT_URL,
  VIEW_BULK_ORDER_URL
} from '../routes/routes';
import { UserOutlined } from '@ant-design/icons';
import bulkOrdersContext from 'src/context/bulkOrders/bulkOrdersContext';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const { bulkOrderId } = React.useContext(bulkOrdersContext);
  const location = useLocation();
  const { isAuthenticated, logout } = React.useContext(authContext);

  const menuItems: MenuProps['items'] = [
    ...(!isAuthenticated
      ? [{ label: <Link to={LOGIN_URL}>Login</Link>, key: LOGIN_URL }]
      : []),
    {
      label: <Link to={CATALOGUE_URL}>Catalogue</Link>,
      key: CATALOGUE_URL
    },
    {
      label: 'Bulk Orders',
      key: 'bulkOrders',
      children: isAuthenticated
        ? [
            {
              label: <Link to={BULK_ORDERS_URL}>My Orders</Link>,
              key: BULK_ORDERS_URL
            },
            {
              label: <Link to={CREATE_BULK_ORDER_URL}>Create Bulk Order</Link>,
              key: CREATE_BULK_ORDER_URL
            }
          ]
        : [
            {
              label: <Link to={CREATE_BULK_ORDER_URL}>Create Bulk Order</Link>,
              key: CREATE_BULK_ORDER_URL
            },
            ...(bulkOrderId
              ? [
                  {
                    label: (
                      <Link
                        to={{
                          pathname: VIEW_BULK_ORDER_URL,
                          search: `?orderId=${bulkOrderId}`
                        }}
                      >
                        View Latest Order
                      </Link>
                    ),
                    key: VIEW_BULK_ORDER_URL
                  }
                ]
              : [])
          ]
    },
    ...(isAuthenticated
      ? [
          {
            label: <UserOutlined />,
            key: 'user',
            children: [
              {
                label: <Link to={MY_ACCOUNT_URL}>My Account</Link>,
                key: MY_ACCOUNT_URL
              },
              {
                label: <Link to={LOGIN_URL}>Logout</Link>,
                key: 'logout',
                onClick: logout
              }
            ]
          }
        ]
      : [])
  ];

  return (
    <Header className='navbar'>
      {isAuthenticated && (
        <div className='logo'>
          <Text className='logo-text'>The Kettle Gourmet</Text>
          <Image
            src={logo}
            width={50}
            preview={false}
            style={{ marginLeft: 5 }}
          />
        </div>
      )}
      <Menu
        theme='dark'
        mode='horizontal'
        disabledOverflow={true}
        style={{ marginLeft: 45 }}
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Header>
  );
};

export default AppHeader;
