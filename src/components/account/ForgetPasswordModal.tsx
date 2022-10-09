import { Modal, Button, Input, Space, Typography } from 'antd';
import { useState } from 'react';
import { forgetPasswordSvc } from '../../services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from '../common/TimeoutAlert';

interface modalProps {
  openPasswordModal: boolean;
  handleClose: () => void;
}

const ForgetPasswordModal = ({
  openPasswordModal,
  handleClose
}: modalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [alert, setAlert] = useState<AlertType | null>(null);
  const { Text } = Typography;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientEmail(e.target.value);
  };

  const handleForgetPassword = async () => {
    console.log('recipientEmail', recipientEmail);
    setLoading(true);
    if (recipientEmail) {
      await asyncFetchCallback(
        forgetPasswordSvc(recipientEmail),
        () => {
          setLoading(false);
          setAlert({
            type: 'success',
            message:
              'A reset password email has been sent to your provided email.'
          });
        },
        () => {
          setLoading(false);
          setAlert({
            type: 'error',
            message: 'Error resetting password. Try again later.'
          });
        }
      );
    }
  };

  return (
    <Modal
      open={openPasswordModal}
      title='Forget Password'
      onOk={handleForgetPassword}
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
          disabled={!recipientEmail}
          onClick={handleForgetPassword}
        >
          Send Email
        </Button>
      ]}
    >
      <Space direction='vertical'>
        {alert && (
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
        )}

        <Typography>
          Enter your login <Text strong>email</Text>. Instructions will be sent
          to you to reset your password.
        </Typography>

        <Input
          size='large'
          placeholder='Enter email here...'
          onChange={handleChange}
        />
      </Space>
    </Modal>
  );
};

export default ForgetPasswordModal;
