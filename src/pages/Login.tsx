import React from 'react';
import '../styles/pages/login.scss';
import '../styles/common/common.scss';
import logo from '../resources/logo-blue.png';
import AuthContext from '../context/auth/authContext';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Layout,
  Space,
  Spin,
  Tooltip
} from 'antd';
import { Typography as AntTypography } from 'antd';
import { LockOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import TimeoutAlert from '../components/common/TimeoutAlert';
import ForgetPasswordModal from '../components/account/ForgetPasswordModal';
import RequestAccountModal from '../components/account/RequestAccountModal';

const { Title } = AntTypography;

const { Content } = Layout;

export interface UserInput {
  email: string;
  password: string;
}

const Login = () => {
  const authContext = React.useContext(AuthContext);
  const { login, clearErrors, toggleRmbMe, isAuthenticated, rmbMe, error } =
    authContext;

  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    } else if (!isAuthenticated && error) {
      setLoading(false);
    }
  }, [isAuthenticated, error, navigate, clearErrors]);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [userInput, setUserInput] = React.useState<UserInput>({
    email: '',
    password: ''
  });
  const [openPasswordModal, setOpenPasswordModal] =
    React.useState<boolean>(false);
  const [reqAccountModal, setReqAccountModal] = React.useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUserInput((prev: UserInput) => {
      return { ...prev, [e.target.name]: e.target.value };
    });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = userInput;
    if (email === '' || password === '') {
      // TODO: handle error case
    } else {
      setLoading(true);
      login(userInput);
    }
  };

  return (
    <Content className='login-content'>
      <ForgetPasswordModal
        openPasswordModal={openPasswordModal}
        handleClose={() => setOpenPasswordModal(false)}
      />
      <RequestAccountModal
        reqAccountModal={reqAccountModal}
        handleClose={() => setReqAccountModal(false)}
      />
      <div className='login-container'>
        <div className='login-box'>
          <Image src={logo} width={250} preview={false} />
          <Title>The Kettle Gourmet B2B</Title>
          <Form
            name='basic'
            initialValues={{ remember: true }}
            autoComplete='off'
            requiredMark={false}
            size='large'
            style={{ width: '100%' }}
          >
            <Form.Item
              name='email'
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input
                name='email'
                placeholder='email'
                prefix={<UserOutlined />}
                onChange={handleChange}
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password
                name='password'
                placeholder='password'
                prefix={<LockOutlined />}
                onChange={handleChange}
              />
            </Form.Item>
            {error && (
              <TimeoutAlert
                alert={{
                  type: 'error',
                  message: error
                }}
                clearAlert={clearErrors}
              />
            )}
            <div className='container-spaced-out'>
              <Form.Item name='remember' valuePropName='checked'>
                <Checkbox checked={rmbMe} onChange={() => toggleRmbMe()}>
                  Remember me
                </Checkbox>
              </Form.Item>
              <Space align='start'>
                <Button
                  type='link'
                  size='small'
                  //   style={{ float: 'right' }}
                  onClick={() => setOpenPasswordModal(true)}
                >
                  Forgot password
                </Button>
              </Space>
            </div>

            <Form.Item>
              {loading ? (
                <Spin size='large' className='container-center' />
              ) : (
                <Button
                  type='primary'
                  htmlType='submit'
                  className='login-btn'
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}
            </Form.Item>
            <Tooltip title='Request for account' mouseEnterDelay={0.5}>
              <Button
                type='link'
                size='small'
                onClick={() => setReqAccountModal(true)}
                style={{ width: 'inherit' }}
              >
                Don't have an account? Request for one here.
              </Button>
            </Tooltip>
          </Form>
        </div>
      </div>
    </Content>
  );
};

export default Login;
