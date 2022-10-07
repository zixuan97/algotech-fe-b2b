import { LoadingOutlined } from '@ant-design/icons';
import { Descriptions, Table, Typography } from 'antd';
import '../../styles/pages/account.scss';
import React, { useState } from 'react';
import authContext from '../../context/auth/authContext';
import { User } from '../../models/types';
import { editUserSvc } from '../../services/accountService';
import { columns, data } from '../../components/common/orders';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import AccountMenu from '../../components/account/AccountMenu';
import EditButtonGroup from '../../components/account/EditButtonGroup';
import ChangePasswordModal from './ChangePasswordModal';
import TimeoutAlert from '../../components/common/TimeoutAlert';
const { Title } = Typography;

const ViewMyAccount = () => {
  const authhenticationContext = React.useContext(authContext);
  const { user, loadUser } = authhenticationContext;
  const [editUser, setEditUser] = useState<User>();
  const [edit, setEdit] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
      <ChangePasswordModal
        open={openModal}
        handleCancel={() => setOpenModal(false)}
        handleSubmit={() => setOpenModal(false)}
        loadUser={() => loadUser()}
        user={user!}
      />
      <div className='account-header-group'>
        <Title level={1}>Your Profile Page</Title>
        <div className='button-group'>
          {loading && <LoadingOutlined />}
          {edit && (
            <EditButtonGroup
              setEdit={setEdit}
              edit={edit}
              user={user!}
              setEditUser={setEditUser}
              handleSaveButtonClick={handleSaveButtonClick}
            />
          )}
          <AccountMenu
            setEdit={() => setEdit(true)}
            setOpenModal={() => setOpenModal(true)}
          />
        </div>
      </div>
      {error && (
        <TimeoutAlert
          alert={{
            type: 'error',
            message: error
          }}
          clearAlert={() => setError('')}
        />
      )}
      <Descriptions size='default' column={2}>
        <Descriptions.Item label='First Name'>Tan</Descriptions.Item>
        <Descriptions.Item label='Last Name'>Wee Kek</Descriptions.Item>
        <Descriptions.Item label='Email'>tanwk@email.com</Descriptions.Item>
        <Descriptions.Item label='Role'>Distributor</Descriptions.Item>
      </Descriptions>
      {/* <Table columns={columns} dataSource={data} />; */}
    </>
  );
};

export default ViewMyAccount;
