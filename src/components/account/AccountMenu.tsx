import { MoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';

interface props {
  setEdit: () => void;
  setOpenModal: () => void;
}

const AccountMenu = ({ setEdit, setOpenModal }: props) => {
  return (
    <>
      <Menu mode='horizontal'>
        <Menu.SubMenu key='SubMenu' icon={<MoreOutlined />}>
          <Menu.Item key='one' onClick={setEdit}>
            Update Information
          </Menu.Item>
          <Menu.Item key='two' onClick={setOpenModal}>
            Change Password
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </>
  );
};

export default AccountMenu;
