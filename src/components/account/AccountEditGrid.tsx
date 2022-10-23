import { Form, Input } from 'antd';
import { User } from '../../models/types';

interface props {
  editUser: User;
  setEditUser: (user: any) => void;
}

const AccountEditGrid = ({ editUser, setEditUser }: props) => {
  const userFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditUser((paramUser: User) => {
      return {
        ...paramUser!,
        [key]: event.target.value
      };
    });
  };

  console.log('edutUser', editUser);
  return (
    <Form
      layout='vertical'
      name='basic'
      labelCol={{ span: 6 }}
      initialValues={{ remember: true }}
      autoComplete='off'
    >
      <Form.Item
        label='First Name'
        rules={[
          { required: true, message: 'First name field cannot be empty!' }
        ]}
      >
        <Input
          value={editUser.firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            userFieldOnChange(e, 'firstName');
          }}
        />
      </Form.Item>
      <Form.Item
        label='Last Name'
        rules={[
          { required: true, message: 'Last name field cannot be empty!' }
        ]}
      >
        <Input
          value={editUser.lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            userFieldOnChange(e, 'lastName');
          }}
        />
      </Form.Item>
      <Form.Item
        label='Email Name'
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!'
          },
          {
            required: true,
            message: 'Please input your E-mail!'
          }
        ]}
      >
        <Input
          value={editUser.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            userFieldOnChange(e, 'email');
          }}
        />
      </Form.Item>

      <Form.Item
        label='Contact Number'
        rules={[
          { required: true, message: 'Please input your contact number!' },
        ]}
      >
        <Input
          value={editUser.contactNo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            userFieldOnChange(e, 'contactNo');
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default AccountEditGrid;
