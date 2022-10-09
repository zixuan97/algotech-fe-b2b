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
  MY_ACCOUNT_URL,
  MY_ORDERS_URL
} from '../routes/routes';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const menuItems: MenuProps['items'] = [
  {
    label: <Link to={CATALOGUE_URL}>Catalogue</Link>,
    key: CATALOGUE_URL
  },
  {
    // label: <Link to={BULK_ORDERS_URL}>Bulk Orders</Link>,
    label: 'Bulk Orders',
    key: BULK_ORDERS_URL,
    children: [
      {
        label: <Link to={CREATE_BULK_ORDER_URL}>Create Bulk Order</Link>,
        key: CREATE_BULK_ORDER_URL
      }
    ]
  },
  {
    label: <Link to={MY_ORDERS_URL}>My Orders</Link>,
    key: MY_ORDERS_URL
  }
];

const AppHeader = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = React.useContext(authContext);

  //TODO: set back conditional rendering to be based on isAuthenticated
  return (
    <Header className='navbar'>
      {true && (
        <>
          <div className='logo'>
            <Text className='logo-text'>The Kettle Gourmet</Text>
            <Image
              src={logo}
              width={50}
              preview={false}
              style={{ marginLeft: 5 }}
            />
          </div>
          <Menu
            theme='dark'
            mode='horizontal'
            disabledOverflow={true}
            style={{ marginLeft: 45 }}
            selectedKeys={[location.pathname]}
            items={menuItems}
          />

          <Menu mode='horizontal' theme='dark'>
            <Menu.SubMenu key='SubMenu' icon={<UserOutlined />}>
              <Menu.Item key='one'>
                <Link to={MY_ACCOUNT_URL}>My Account</Link>
              </Menu.Item>
              <Menu.Item key='two' onClick={logout}>
                Logout
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </>
      )}
    </Header>
  );
};

export default AppHeader;
