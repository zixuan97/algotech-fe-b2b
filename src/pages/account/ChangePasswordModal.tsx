import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Modal, Button, Input, Space, Form } from 'antd';
import { useState } from 'react';
import { User } from '../../models/types';
import { updatePasswordSvc } from '../../services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import validator from 'validator';

interface props {
  open: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  user: User;
  loadUser: () => void;
}

const ChangePasswordModal = ({
  open,
  handleCancel,
  handleSubmit,
  user,
  loadUser
}: props) => {
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const updatePassword = (e: any) => {
    e.preventDefault();
    setLoading(true);
    asyncFetchCallback(
      updatePasswordSvc(user?.email!, currentPassword, newPassword),
      () => {
        setLoading(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        loadUser();
      },
      (err) => {
        //Catch error and log
        setLoading(false);
      }
    );
  };

  return (
    <Modal
      width={600}
      open={open}
      title='Change Password'
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Return
        </Button>,
        <Button
          key='submit'
          type='primary'
          loading={loading}
          onClick={updatePassword}
          disabled={
            currentPassword === newPassword || newPassword !== confirmPassword
          }
        >
          Update Password
        </Button>
      ]}
    >
      <Space direction='vertical'>
        <Form
          name='basic'
          labelCol={{ span: 10 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item
            label='Current Password'
            name='currentPassword'
            rules={[
              {
                required: true,
                message: 'Please input your current password!'
              }
            ]}
          >
            <Input.Password
              onChange={(e: any) => {
                setCurrentPassword(e.target.value);
              }}
              placeholder='Current Password'
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            label='New Password'
            name='newPassword'
            rules={[
              {
                required: true,
                message: 'Please input a new password!'
              }
            ]}
          >
            <Input.Password
              onChange={(e: any) => {
                setNewPassword(e.target.value);
              }}
              placeholder='New Password'
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            label='Confirm Password'
            name='confirmPassword'
            rules={[
              {
                required: true,
                message: 'Please input the new password again!'
              }
            ]}
          >
            <Input.Password
              onChange={(e: any) => {
                setConfirmPassword(e.target.value);
              }}
              placeholder='Confirm New Password'
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  );
};

export default ChangePasswordModal;
