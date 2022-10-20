import { InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Space,
  Typography,
  Input,
  Form,
  InputNumber,
  Select
} from 'antd';
import { startCase } from 'lodash';
import React from 'react';
import { useLocation } from 'react-router-dom';
import authContext from 'src/context/auth/authContext';
import bulkOrdersContext from 'src/context/bulkOrders/bulkOrdersContext';
import { PaymentMode } from 'src/models/types';
import {
  getPaymentForBulkOrder,
  getBulkOrderByOrderId
} from 'src/services/bulkOrdersService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  convertBulkOrdersToFormValues,
  convertFormValuesToBulkOrder,
  Hamper,
  hasValidHampers
} from '../../components/bulkOrders/bulkOrdersHelper';
import Hampers from '../../components/bulkOrders/createBulkOrder/hampers/Hampers';
import MessageTemplate, {
  MESSAGE_TEMPLATE_DESC,
  MsgTmpl
} from '../../components/bulkOrders/createBulkOrder/MessageTemplate';
import ConfirmationModalButton from '../../components/common/ConfirmationModalButton';
import DynamicFormItem from '../../components/common/DynamicFormItem';
import '../../styles/common/common.scss';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateBulkOrder = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  const { isAuthenticated, user } = React.useContext(authContext);
  const { updateBulkOrderId } = React.useContext(bulkOrdersContext);

  const [form] = Form.useForm();
  const [hampersMap, setHampersMap] = React.useState<Map<string, Hamper>>(
    new Map()
  );

  const [msgTmpl, setMsgTmpl] = React.useState<MsgTmpl>({
    tmpl: '',
    varSymbolCount: 0
  });
  const [disableFormBtns, setDisableFormBtns] = React.useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (orderId) {
      asyncFetchCallback(getBulkOrderByOrderId(orderId), (res) => {
        const [formValues, generatedHampersMap] =
          convertBulkOrdersToFormValues(res);
        setHampersMap(generatedHampersMap);
        form.setFieldsValue(formValues);
      });
    }
  }, [orderId, form]);

  const onFinish = (values: any) => {
    const bulkOrder = convertFormValuesToBulkOrder(values, hampersMap, msgTmpl);
    console.log(bulkOrder);

    // TODO: implement redirect to payment page
    setSubmitLoading(true);
    asyncFetchCallback(
      getPaymentForBulkOrder(bulkOrder),
      (res) => {
        console.log(res);
        updateBulkOrderId(res.bulkOrder.orderId);
      },
      (err) => console.log(err),
      { updateLoading: setSubmitLoading, delay: 500 }
    );
  };

  return (
    <div className='container-left' style={{ marginBottom: '2em' }}>
      <Title level={2}>Create Bulk Order</Title>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <Text>
          Bulk orders allow you to send the same hamper to multiple addresses.
        </Text>
        <Title level={4} style={{ marginTop: 10 }}>
          Payee Details
        </Title>
        <Form
          form={form}
          name='hamperOrders'
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 8 }}
          autoComplete='off'
        >
          <Form.Item
            label='Name'
            name='payeeName'
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Email'
            name='payeeEmail'
            rules={[
              { type: 'email', message: 'Please input a valid email!' },
              { required: true, message: 'Please input your email!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Contact No.'
            name='payeeContactNo'
            rules={[
              { required: true, message: 'Please input your contact number!' }
            ]}
          >
            <InputNumber
              controls={false}
              style={{ width: '100%' }}
              stringMode
            />
          </Form.Item>
          <Form.Item label='Company' name='payeeCompany'>
            <Input />
          </Form.Item>
          <Form.Item
            label='Payment Mode'
            name='paymentMode'
            rules={[
              { required: true, message: 'Please select a payment mode!' }
            ]}
          >
            <Select>
              {Object.values(PaymentMode).map((paymentMode) => (
                <Option key={paymentMode} value={paymentMode}>
                  {startCase(paymentMode.toLowerCase())}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Remarks' name='payeeRemarks'>
            <TextArea rows={3} />
          </Form.Item>
        </Form>
        {/* <Title level={4}>Excel Upload</Title>
        <Button type='primary' icon={<DownloadOutlined />}>
          Download Excel Template
        </Button>
        <Space align='start' size='large'>
          <Text>Upload Template (optional):</Text>
          <Upload maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to upload template</Button>
          </Upload>
        </Space> */}
        <Space direction='vertical' style={{ width: '100%' }}>
          <Title level={4} style={{ marginTop: 10 }}>
            Hampers
          </Title>
          <Hampers
            hampers={[...hampersMap.values()]}
            updateHampers={(hampers) =>
              setHampersMap(
                new Map<string, Hamper>(
                  hampers.map((hamper) => [hamper.id, hamper])
                )
              )
            }
          />
        </Space>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Space align='baseline'>
            <Title level={4}>Message Template</Title>
            <ConfirmationModalButton
              modalProps={{
                title: 'Message Template',
                body: MESSAGE_TEMPLATE_DESC,
                onConfirm: () => void 0
              }}
              type='text'
              shape='circle'
              icon={<InfoCircleOutlined />}
            />
          </Space>
          <MessageTemplate msgTmpl={msgTmpl} updateMsgTmpl={setMsgTmpl} />
        </Space>
        <Title level={4}>Hamper Orders</Title>
        <Form
          name='hamperOrders'
          onFinish={onFinish}
          scrollToFirstError
          onValuesChange={(_, allValues) =>
            setDisableFormBtns(!allValues?.hamperOrdersList?.length)
          }
          form={form}
        >
          <DynamicFormItem
            formName='hamperOrders'
            addBtnTxt='Add Customer'
            disableAdd={!hasValidHampers([...hampersMap.values()])}
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
                  name={[name, 'hamperId']}
                  rules={[{ required: true, message: 'Hamper type required' }]}
                  style={{ flex: 0.5 }}
                >
                  <Select placeholder='Hamper'>
                    {[...hampersMap.values()].map((hamper) => (
                      <Option key={hamper.id} value={hamper.id}>
                        {hamper.hamperName}
                      </Option>
                    ))}
                  </Select>
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
                {Array.from(
                  { length: msgTmpl.varSymbolCount },
                  (_, i) => i + 1
                ).map((i) => (
                  <Form.Item
                    {...restField}
                    key={i}
                    name={[name, `msgVar${i}`]}
                    rules={[
                      { required: true, message: 'Msg variable required' }
                    ]}
                    style={{ flex: 1.5 / msgTmpl.varSymbolCount }}
                  >
                    <Input placeholder={`Msg Variable ${i}`} />
                  </Form.Item>
                ))}
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
              disabled={disableFormBtns}
            >
              Cancel
            </ConfirmationModalButton>
            <Form.Item style={{ flex: 1 }}>
              <Button
                type='primary'
                htmlType='submit'
                block
                disabled={disableFormBtns}
                loading={submitLoading}
              >
                Make Payment
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Space>
    </div>
  );
};

export default CreateBulkOrder;
