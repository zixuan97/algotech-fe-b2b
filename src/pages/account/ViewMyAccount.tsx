import {
  EyeTwoTone,
  EyeInvisibleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { Button, Collapse, Descriptions, Input, Space, Typography } from 'antd';
import '../../styles/pages/account.scss';
import React, { useState } from 'react';
import authContext from '../../context/auth/authContext';
import { User } from '../../models/types';
import { editUserSvc } from '../../services/accountService';
const { Panel } = Collapse;
const { Title } = Typography;

const ViewMyAccount = () => {
  const authhenticationContext = React.useContext(authContext);
  const { user, loadUser } = authhenticationContext;
  const [editUser, setEditUser] = useState<User>();
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (user) {
      setEditUser(user);
    }
  }, [user]);

  const handleSaveButtonClick = (e: any) => {
    e.preventDefault();
    setLoading(true);
    asyncFetchCallback(
      editUserSvc(editUser!),
      () => {
        setLoading(false);
        loadUser();
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <>
      <div className='account-header-group'>
        <Title level={2}>Your Profile Page</Title>
        <div className='button-group'>
          {loading && <LoadingOutlined />}
          {edit && (
            <Button
              className='create-btn'
              color='primary'
              onClick={() => {
                setEdit(false);
                user && setEditUser(user);
              }}
            >
              DISCARD CHANGES
            </Button>
          )}
          <Button
            type='primary'
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!edit) {
                setEdit(true);
              } else {
                handleSaveButtonClick(e);
                setEdit(false);
              }
            }}
          >
            {edit ? 'SAVE CHANGES' : 'EDIT'}
          </Button>
        </div>
      </div>

      <Descriptions size='default' column={2}>
        <Descriptions.Item label='First Name'>Tan</Descriptions.Item>
        <Descriptions.Item label='Last Name'>Wee Kek</Descriptions.Item>
        <Descriptions.Item label='Email'>tanwk@email.com</Descriptions.Item>
        <Descriptions.Item label='Role'>Distributor</Descriptions.Item>
      </Descriptions>

      <Collapse accordion>
        <Panel header='Change Password' key='1'>
          <Space direction='vertical'>
            <Input.Password
              style={{ width: '100%' }}
              placeholder='Current Password'
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Input.Password
              placeholder='New Password'
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Input.Password
              placeholder='Confirm New Password'
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <Button type='primary'>Update Password</Button>
          </Space>
        </Panel>
      </Collapse>
    </>
  );
};

export default ViewMyAccount;
function asyncFetchCallback(arg0: any, arg1: () => void, arg2: () => void) {
  throw new Error('Function not implemented.');
}
