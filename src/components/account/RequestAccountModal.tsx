import {
  Modal,
  Button,
  Input,
  Space,
  Typography,
  Form
} from 'antd';
import { useState } from 'react';
import { User } from '../../models/types';
import { requestB2BUserSvc } from '../../services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';

interface modalProps {
  reqAccountModal: boolean;
  handleClose: () => void;
}

const RequestAccountModal = ({ reqAccountModal, handleClose }: modalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [form] = Form.useForm();

  const onFinish = (values: User) => {
    setLoading(true);
    asyncFetchCallback(
      requestB2BUserSvc(values),
      () => {
        setAlert({
          type: 'success',
          message:
            'Your request has been sent. We will contact you via email regarding your account approval.'
        });
        setLoading(false);
        form.resetFields();
        setTimeout(() => handleClose(), 3500);
      },
      () => {
        setAlert({
          type: 'error',
          message: 'Error requesting an account. Try again later.'
        });
        setLoading(false);
      }
    );
  };

  return (
    <Modal
      open={reqAccountModal}
      title='Request For Account'
      onCancel={handleClose}
      onOk={() => form.submit()}
      centered
      footer={[
        <Button key='back' onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          key='submit'
          type='primary'
          loading={loading}
          onClick={() => form.submit()}
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
          onFinish={onFinish}
          autoComplete='off'
          form={form}
        >
          <Form.Item
            label='First Name'
            name='firstName'
            rules={[
              { required: true, message: 'Please input your first name!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Last Name'
            name='lastName'
            rules={[
              { required: true, message: 'Please input your last name!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Contact No'
            name='contactNo'
            rules={[
              { required: true, message: 'Please input your contact number!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Company Name'
            name='company'
          >
            <Input />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  );
};

export default RequestAccountModal;
