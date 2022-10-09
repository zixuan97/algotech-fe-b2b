import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Space,
  Typography,
  Upload,
  Input,
  Form,
  InputNumber,
  Select
} from 'antd';
import React from 'react';
import HamperCard from '../../components/bulkOrders/createBulkOrder/HamperCard';
import MessageTemplate from '../../components/bulkOrders/createBulkOrder/MessageTemplate';
import ConfirmationModalButton from '../../components/common/ConfirmationModalButton';
import DynamicFormItem from '../../components/common/DynamicFormItem';
import '../../styles/common/common.scss';

const { Title, Text } = Typography;

const CreateBulkOrder = () => {
  const [form] = Form.useForm();
  const [msgTmpl, setMsgTmpl] = React.useState<string>('');
  const [disableFormBtns, setDisableFormBtns] = React.useState<boolean>(true);

  return (
    <div className='container-left' style={{ marginBottom: '2em' }}>
      <Title level={2}>Create Bulk Order</Title>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Text>
          Bulk orders allow you to send the same hamper to multiple addresses.
        </Text>
        <Button type='primary' icon={<DownloadOutlined />}>
          Download Excel Template
        </Button>
        <Space align='start' size='large'>
          <Text>Upload Template (optional):</Text>
          <Upload maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to upload template</Button>
          </Upload>
        </Space>
        <Title level={4} style={{ marginTop: 10 }}>
          Hampers
        </Title>
        <HamperCard />
        <Space direction='vertical' style={{ width: '100%' }}>
          <Title level={4}>Message Template</Title>
          <MessageTemplate msgTmpl={msgTmpl} updateMsgTmpl={setMsgTmpl} />
        </Space>
        <Title level={4}>Hamper Orders</Title>
        <Form
          name='hamperOrders'
          onFinish={(values) => {
            console.log(values);
          }}
          onValuesChange={(_, allValues) =>
            setDisableFormBtns(!allValues?.hamperOrdersList?.length)
          }
          form={form}
        >
          <DynamicFormItem
            formName='hamperOrders'
            addBtnTxt='Add Customer'
            formChildren={({ key, name, ...restField }) => (
              <>
                <Form.Item
                  {...restField}
                  name={[name, 'customerName']}
                  rules={[
                    { required: true, message: 'Customer name required' }
                  ]}
                  style={{ flex: 2 }}
                >
                  <Input placeholder='Customer Name' />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'customerContactNo']}
                  rules={[{ required: true, message: 'Contact no. required' }]}
                  style={{ flex: 1 }}
                >
                  <InputNumber
                    placeholder='Contact Number'
                    controls={false}
                    style={{ width: '100%' }}
                    stringMode
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'hamper']}
                  //   rules={[{ required: true, message: 'Hamper type required' }]}
                  style={{ flex: 0.5 }}
                >
                  <Select placeholder='Hamper' />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'quantity']}>
                  <InputNumber min={1} placeholder='Qty' />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'customerAddress']}
                  rules={[{ required: true, message: 'Address required' }]}
                  style={{ flex: 1 }}
                >
                  <Input placeholder='Address' />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'postalCode']}
                  rules={[{ required: true, message: 'Postal code required' }]}
                  style={{ flex: 0.5 }}
                >
                  <Input placeholder='Postal Code' />
                </Form.Item>
              </>
            )}
          />
          <div className='container-spaced-out' style={{ marginTop: '2em' }}>
            {/* <Button style={{ flex: 1 }} onClick={() => form.resetFields()}>
              Cancel
            </Button> */}
            <ConfirmationModalButton
              modalProps={{
                title: 'Confirm Cancel',
                body: 'Are you sure you want to cancel all hamper orders?',
                onConfirm: () => {
                  form.resetFields();
                  setDisableFormBtns(true);
                }
              }}
              style={{ flex: 1 }}
              buttonTxt='Cancel'
              disabled={disableFormBtns}
            />
            <Form.Item style={{ flex: 1 }}>
              <Button
                type='primary'
                htmlType='submit'
                block
                disabled={disableFormBtns}
              >
                Submit Order
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Space>
    </div>
  );
};

export default CreateBulkOrder;
