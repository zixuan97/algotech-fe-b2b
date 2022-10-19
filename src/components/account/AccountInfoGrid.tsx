import { Card, Space, Typography } from 'antd';
import _ from 'lodash';
import { User } from '../../models/types';

interface props {
  user: User;
}

const AccountInfoGrid = ({ user }: props) => {
  return (
    <>
      <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
        <Card title='First Name' size='small'>
          <Typography>{_.startCase(user?.firstName)}</Typography>
        </Card>
        <Card title='Last Name' size='small'>
          <Typography>{_.startCase(user?.lastName)}</Typography>
        </Card>
        <Card title='Email' size='small'>
          <Typography>{user?.email}</Typography>
        </Card>
        <Card title='Role' size='small'>
          <Typography>{_.startCase(user?.role.toString().toLowerCase())}</Typography>
        </Card>
      </Space>
    </>
  );
};

export default AccountInfoGrid;
