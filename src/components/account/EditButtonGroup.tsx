import { Button, Space } from 'antd';
import { User } from '../../models/types';

interface props {
  setEdit: (boolean: boolean) => void;
  edit: boolean;
  user: User;
  editUser: User;
  setEditUser: (user: User) => void;
  handleSaveButtonClick: (e: any) => void;
}

const EditButtonGroup = ({
  setEdit,
  edit,
  user,
  editUser,
  setEditUser,
  handleSaveButtonClick
}: props) => {
  return (
    <>
      <Space>
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
        <Button
          type='primary'
          disabled={!(editUser.email && editUser.firstName && editUser.lastName)}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (!edit) {
              setEdit(true);
            } else {
              handleSaveButtonClick(e);
              setEdit(false);
            }
          }}
        >
          SAVE CHANGES
        </Button>
      </Space>
    </>
  );
};

export default EditButtonGroup;
