import { LoadingOutlined } from '@ant-design/icons';
import { Typography, Skeleton } from 'antd';
import '../../styles/pages/account.scss';
import React, { useState } from 'react';
import authContext from '../../context/auth/authContext';
import { User } from '../../models/types';
import { editUserSvc } from '../../services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import AccountMenu from '../../components/account/AccountMenu';
import EditButtonGroup from '../../components/account/EditButtonGroup';
import ChangePasswordModal from '../../components/account/ChangePasswordModal';
import TimeoutAlert, { AlertType } from '../../components/common/TimeoutAlert';
import AccountInfoGrid from '../../components/account/AccountInfoGrid';
import AccountEditGrid from '../../components/account/AccountEditGrid';
const { Title } = Typography;

const ViewMyAccount = () => {
  const authhenticationContext = React.useContext(authContext);
  const { user, loadUser } = authhenticationContext;
  const [editUser, setEditUser] = useState<User>();
  const [edit, setEdit] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertType | null>(null);

  React.useEffect(() => {
    if (user) {
      if (!user.isVerified) {
        setOpenModal(true);
      }
      setEditUser(user);
    }
    console.log('user', user);
  }, [user]);

  const handleSaveButtonClick = (e: any) => {
    e.preventDefault();
    setLoading(true);
    asyncFetchCallback(
      editUserSvc(editUser!),
      () => {
        setLoading(false);
        setAlert({
          type: 'success',
          message: 'Edits to your account has been saved.'
        });
        loadUser();
      },
      () => {
        setAlert({
          type: 'error',
          message: 'Failed to save changes. Contact the admin.'
        });
        setLoading(false);
      }
    );
  };

  return (
    <>
      {user && (
        <ChangePasswordModal
          open={openModal}
          handleCancel={() => setOpenModal(false)}
          handleSubmit={() => setOpenModal(false)}
          loadUser={() => loadUser()}
          user={user}
        />
      )}

      <div className='account-header-group'>
        <Title level={1}>Your Profile Page</Title>
        <div className='button-group'>
          {loading && <LoadingOutlined />}
          {edit && (
            <EditButtonGroup
              setEdit={setEdit}
              edit={edit}
              user={user!}
              editUser={editUser!}
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
      {alert && (
        <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
      )}

      {loading && <Skeleton />}
      {edit ? (
        <AccountEditGrid editUser={editUser!} setEditUser={setEditUser} />
      ) : (
        <AccountInfoGrid user={user!} />
      )}
    </>
  );
};

export default ViewMyAccount;
