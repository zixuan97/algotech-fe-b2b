import React from 'react';

import { Breadcrumb, Layout } from 'antd';
import { Link, Location, Outlet, useLocation } from 'react-router-dom';
import { FRONT_SLASH } from '../utils/constants';
import { startCase } from 'lodash';
import AppHeader from '../components/common/AppHeader';

const { Content, Sider } = Layout;

type HomeProps = {
  children?: React.ReactNode;
};

const getBreadcrumbItems = (location: Location) => {
  const locations = location.pathname.split(FRONT_SLASH);
  const breadcrumbs = [];
  let currPath = '';
  for (let i = 0; i < locations.length; i++) {
    currPath = `${currPath}${locations[i]}/`;
    const actualPath = currPath.replace(/\/+$/, '');

    breadcrumbs.push(
      <Breadcrumb.Item key={actualPath}>
        <Link to={actualPath}>
          {i === 0 ? 'Home' : startCase(locations[i])}
        </Link>
      </Breadcrumb.Item>
    );
  }
  return breadcrumbs;
};

const Home = ({ children }: HomeProps) => {
  const location = useLocation();

  return (
    <Content style={{ padding: '0 50px' }}>
      <AppHeader />
      <Breadcrumb style={{ margin: '16px 0' }}>
        {getBreadcrumbItems(location)}
      </Breadcrumb>
      <Layout style={{ padding: '24px 0', background: '#fff', height: '95%' }}>
        {/* <Sider width='15vw' style={{ background: '#fff' }}>
          <Menu mode='inline' style={{ height: '100%' }} />
        </Sider> */}
        <Content
          style={{ padding: '0 24px', minHeight: 280, overflow: 'auto' }}
        >
          <Outlet />
          {children && children}
        </Content>
      </Layout>
    </Content>
  );
};

export default Home;
