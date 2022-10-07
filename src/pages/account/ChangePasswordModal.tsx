import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Modal, Button, Input, Space } from 'antd';
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
  const [showCurrPwdError, setShowCurrPwdError] = useState<boolean>(false);
  const [showNewPwdError, setShowNewPwdError] = useState<boolean>(false);
  const [showCfmPwdError, setShowCfmPwdError] = useState<boolean>(false);

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
        setShowNewPwdError(false);
        setShowCurrPwdError(false);
        setShowCfmPwdError(false);
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
        >
          Update Password
        </Button>
      ]}
    >
      <Space direction='vertical'>
        <Input.Password
          onChange={(e: any) => {
            setCurrentPassword(e.target.value);
            setShowCurrPwdError(true);
          }}
          style={{ width: '100%' }}
          placeholder='Current Password'
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
        <Input.Password
          status={
            (newPassword === currentPassword ||
              validator.isEmpty(currentPassword)) &&
            showNewPwdError
              ? 'error'
              : ''
          }
          onChange={(e: any) => {
            setNewPassword(e.target.value);
            setShowNewPwdError(true);
          }}
          placeholder='New Password'
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
        <Input.Password
          onChange={(e: any) => {
            setConfirmPassword(e.target.value);
            setShowCfmPwdError(true);
          }}
          placeholder='Confirm New Password'
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Space>
    </Modal>
  );
};

export default ChangePasswordModal;
