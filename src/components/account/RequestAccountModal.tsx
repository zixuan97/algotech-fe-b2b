import {
  Modal,
  Button,
  Input,
  Space,
  Typography,
  Form,
  RadioChangeEvent,
  Radio
} from 'antd';
import { useState } from 'react';
import { User, UserRole } from '../../models/types';
import { requestB2BUserSvc } from '../../services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';

interface modalProps {
  reqAccountModal: boolean;
  handleClose: () => void;
}

export type NewUserType = Partial<User>;

const RequestAccountModal = ({ reqAccountModal, handleClose }: modalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<NewUserType>({});
  const [alert, setAlert] = useState<AlertType | null>(null);

  const handleReqButtonClick = (e: any) => {
    setLoading(true);
    if (
      newUser.email &&
      newUser.firstName &&
      newUser.lastName &&
      newUser.role
    ) {
      setLoading(true);
      e.preventDefault();
      asyncFetchCallback(
        requestB2BUserSvc(newUser),
        () => {
          setNewUser({});
          setAlert({
            type: 'success',
            message:
              'Your request has been sent. We will contact you via email regarding your account approval.'
          });
          setLoading(false);
        },
        () => {
          setAlert({
            type: 'error',
            message: 'Error requesting an account. Try again later.'
          });
          setLoading(false);
        }
      );
    }
  };

  const userFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setNewUser((user: NewUserType) => {
      return {
        ...user,
        [key]: event.target.value
      };
    });
  };

  const onChange = (e: RadioChangeEvent) => {
    setNewUser((user: NewUserType) => {
      return {
        ...user,
        role: e.target.value
      };
    });
  };

  const accountType = [
    { label: 'Corporate', value: UserRole.CORPORATE },
    { label: 'Distributor', value: UserRole.DISTRIBUTOR }
  ];

  return (
    <Modal
      open={reqAccountModal}
      title='Request For Account'
      onOk={handleReqButtonClick}
      onCancel={handleClose}
      centered
      footer={[
        <Button key='back' onClick={handleClose}>
          Close
        </Button>,
        <Button
          key='submit'
          type='primary'
          loading={loading}
          onClick={handleReqButtonClick}
          disabled={
            !(
              newUser.email &&
              newUser.firstName &&
              newUser.lastName &&
              newUser.role
            )
          }
        >
          Request Account
        </Button>
      ]}
    >
      <Space direction='vertical'>
        {alert && (
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
        )}
        <Typography style={{ marginBottom: '5%' }}>
          Enter your details here to request for an account. You will receive an
          email when your request has been approved.
        </Typography>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item
            label='First Name'
            name='firstName'
            rules={[
              { required: true, message: 'Please input your first name!' }
            ]}
          >
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                userFieldOnChange(e, 'firstName');
              }}
            />
          </Form.Item>

          <Form.Item
            label='Last Name'
            name='lastName'
            rules={[
              { required: true, message: 'Please input your last name!' }
            ]}
          >
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                userFieldOnChange(e, 'lastName');
              }}
            />
          </Form.Item>

          <Form.Item
            label='Contact Number'
            name='contactNo'
            rules={[
              { required: true, message: 'Please input your contact number!' }
            ]}
          >
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                userFieldOnChange(e, 'contactNo');
              }}
            />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
            ]}
          >
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                userFieldOnChange(e, 'email');
              }}
            />
          </Form.Item>

          <Form.Item
            label='Company'
            name='company'
            rules={[
              { required: true, message: 'Please input your company name!' }
            ]}
          >
            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                userFieldOnChange(e, 'company');
              }}
            />
          </Form.Item>

          <Form.Item
            label='Role'
            name='role'
            rules={[{ required: true, message: 'Please chose your role.' }]}
          >
            <Radio.Group onChange={onChange}>
              {accountType.map((account) => (
                <Radio key={account.value} value={account.value}>
                  {account.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  );
};

export default RequestAccountModal;
