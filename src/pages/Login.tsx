import React from 'react';
import '../styles/pages/login.scss';
import '../styles/common/common.scss';
import logo from '../resources/logo-blue.png';
import AuthContext from '../context/auth/authContext';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Image, Input, Layout, Tooltip } from 'antd';
import { Typography as AntTypography } from 'antd';
import { LockOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import TimeoutAlert from '../components/common/TimeoutAlert';

const { Text, Title } = AntTypography;

const { Content } = Layout;

export interface UserInput {
  email: string;
  password: string;
}

const Login = () => {
  const authContext = React.useContext(AuthContext);
  const { login, clearErrors, isAuthenticated, rememberMe, error } =
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
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

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
              name='username'
              rules={[
                { required: true, message: 'Please input your username!' }
              ]}
            >
              <Input placeholder='email' prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password
                placeholder='password'
                prefix={<LockOutlined />}
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
            <Form.Item name='remember' valuePropName='checked'>
              <Checkbox checked={rememberMe}>Remember me</Checkbox>
              <Tooltip title='Request for account' mouseEnterDelay={0.5}>
                <Button
                  type='primary'
                  shape='circle'
                  size='small'
                  icon={<UserAddOutlined />}
                  style={{ float: 'right', marginLeft: 10 }}
                />
              </Tooltip>
              <Button type='link' size='small' style={{ float: 'right' }}>
                Forgot password
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='login-btn'
                onClick={handleLogin}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Content>
  );
};

export default Login;
