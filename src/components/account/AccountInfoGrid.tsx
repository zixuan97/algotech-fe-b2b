import { Col, Descriptions, Row, Typography } from 'antd';
import { User } from '../../models/types';

interface props {
  user: User;
}

const AccountInfoGrid = ({ user }: props) => {
  return (
    <>
      <Descriptions size='default' column={2}>
        <Descriptions.Item label='First Name'>
          {user?.firstName}
        </Descriptions.Item>
        <Descriptions.Item label='Last Name'>
          {user?.lastName}
        </Descriptions.Item>
        <Descriptions.Item label='Email'>{user?.email}</Descriptions.Item>
        <Descriptions.Item label='Role'>{user?.role} ({user?.status})</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default AccountInfoGrid;
