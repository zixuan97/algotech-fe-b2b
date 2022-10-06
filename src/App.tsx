import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import AppHeader, { ROOT_NAV_URLS } from './components/common/AppHeader';
import ViewMyAccount from './pages/account/ViewMyAccount';

const { Footer } = Layout;

const App = () => {
  const token = sessionStorage.token ?? localStorage.token;
  React.useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <AuthState>
      <Router>
        <Layout style={{ height: '100vh' }}>
          <AppHeader />
          <Layout>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route
                path='/'
                element={
                  <AuthRoute redirectTo='/login'>
                    <Home />
                  </AuthRoute>
                }
              >
                {/* products routes */}
                <Route path={ROOT_NAV_URLS.PRODUCTS} element={<></>} />
                {/* customer routes */}
                <Route path={ROOT_NAV_URLS.CUSTOMER} element={<></>} />
                {/* distributor routes */}
                <Route path={ROOT_NAV_URLS.DISTRIBUTOR} element={<></>} />
                {/* my orders routes */}
                <Route path={ROOT_NAV_URLS.MY_ORDERS} element={<></>} />
                {/* my profile routes */}
                <Route path={ROOT_NAV_URLS.MY_ACCOUNT} element={<ViewMyAccount/>} />
              </Route>
            </Routes>
          </Layout>
          <Footer style={{ textAlign: 'center' }}>
            The Kettle Gourmet ©2022 All Rights Reserved
          </Footer>
        </Layout>
      </Router>
    </AuthState>

    // </ConfigProvider>
    // </ThemeProvider>
  );
};

export default App;
