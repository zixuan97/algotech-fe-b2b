import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import React from 'react';
import AuthRoute from './components/auth/AuthRoute';
import AuthState from './context/auth/AuthState';
import Login from './pages/Login';
import { setAuthToken } from './utils/authUtils';
import Home from './pages/Home';
import 'antd/dist/antd.variable.min.css';
import './styles/common/common.scss';
import './styles/custom-antd.scss';
import { Layout } from 'antd';
import ViewMyAccount from './pages/account/ViewMyAccount';
import {
  BULK_ORDERS_URL,
  CATALOGUE_URL,
  CREATE_BULK_ORDER_URL,
  LOGIN_URL,
  MY_ACCOUNT_URL,
  VIEW_BULK_ORDER_URL
} from './components/routes/routes';
import CreateBulkOrder from './pages/bulkOrders/CreateBulkOrder';
import AppHeader from './components/common/AppHeader';
import BulkOrdersState from './context/bulkOrders/BulkOrdersState';
import moment from 'moment';
import MyBulkOrders from './pages/bulkOrders/MyBulkOrders';
import ViewBulkOrder from './pages/bulkOrders/ViewBulkOrder';
import NotFound from './pages/NotFound';
import Catalogue from './pages/catalogue/Catalogue';

const { Footer } = Layout;

const App = () => {
  const token = sessionStorage.token ?? localStorage.token;
  React.useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <AuthState>
      <BulkOrdersState>
        <Router>
          <Layout style={{ height: '100vh' }}>
            <Layout>
              <AppHeader />
              <Routes>
                {/* public routes */}
                <Route path={LOGIN_URL} element={<Login />} />
                {/* catalogue routes */}
                <Route
                  path={CATALOGUE_URL}
                  element={
                    <Home>
                      <Catalogue />
                    </Home>
                  }
                />
                <Route
                  path={CREATE_BULK_ORDER_URL}
                  element={
                    <Home>
                      <CreateBulkOrder />
                    </Home>
                  }
                />
                <Route
                  path={VIEW_BULK_ORDER_URL}
                  element={
                    <Home>
                      <ViewBulkOrder />
                    </Home>
                  }
                />

                {/* private routes */}
                <Route
                  path={MY_ACCOUNT_URL}
                  element={
                    <AuthRoute redirectTo={LOGIN_URL}>
                      <Home>
                        <ViewMyAccount />
                      </Home>
                    </AuthRoute>
                  }
                />

                <Route
                  path='/'
                  element={
                    <AuthRoute
                      redirectTo={LOGIN_URL}
                      unverifiedRedirect={MY_ACCOUNT_URL}
                    >
                      <Home />
                    </AuthRoute>
                  }
                >
                  <Route
                    index
                    element={<Navigate replace to={BULK_ORDERS_URL} />}
                  />
                  {/* bulk order routes */}
                  <Route path={BULK_ORDERS_URL} element={<MyBulkOrders />} />
                  {/* my profile routes */}
                  <Route path={MY_ACCOUNT_URL} element={<ViewMyAccount />} />
                </Route>
                <Route
                  path='*'
                  element={
                    <Home>
                      <NotFound />
                    </Home>
                  }
                />
              </Routes>
            </Layout>
            <Footer style={{ textAlign: 'center' }}>
              The Kettle Gourmet ©{moment().year()} All Rights Reserved
            </Footer>
          </Layout>
        </Router>
      </BulkOrdersState>
    </AuthState>

    // </ConfigProvider>
    // </ThemeProvider>
  );
};

export default App;
