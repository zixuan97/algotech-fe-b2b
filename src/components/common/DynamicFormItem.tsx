import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, FormListFieldData } from 'antd';
import '../../styles/common/common.scss';

type DynamicFormItemProps = {
  formName: string;
  formChildren: (field: FormListFieldData) => React.ReactNode;
  addBtnTxt: string;
  disableAdd?: boolean;
};

/**
 * This is one hell of a complicated component to use, so I'll try my best to explain how to use it here.
 *
 * This component is meant as an abstraction around this: https://ant.design/components/form/#components-form-demo-dynamic-form-items
 *
 * The Form and Form.List component will handle all CRUD operations, so there is no need to manually manipulate the form to handle such cases.
 * It will return all accumulated results in the onFinish method using the 'values' param.
 *
 * In the onFinish method, the form returns you an object, consisting of a single array of objects.
 * The keys of these objects correspond to the 'name' prop of all your Form.Item components in @param formChildren.
 * The name of the array will be `${@param formName}List`.
 *
 * For example, if I pass in formName = customerName, and collected their firstName and lastName in formChildren, I would have this structure returned to me in the onFinish method:
 *
 * values = {
 * 	 customerNameList: [
 *     firstName: 'John',
 *     lastName: 'Doe',
 *   ]
 * }
 *
 * @param formName: the name of the form
 * @param formChildren: the contents comprising each form. For the form to work properly, it should consist of a number of <Form.Item /> components enclosed within a JSX fragment.
 */
const DynamicFormItem = ({
  formName,
  formChildren,
  addBtnTxt,
  disableAdd = false
}: DynamicFormItemProps) => {
  return (
    <Form.List name={`${formName}List`}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <div
              key={field.key}
              className='container-spaced-out'
              style={{ marginBottom: 4 }}
            >
              {formChildren(field)}
              <MinusCircleOutlined
                onClick={() => {
                  remove(field.name);
                }}
              />
            </div>
          ))}
          <Button
            type='dashed'
            onClick={() => {
              add();
            }}
            block
            icon={<PlusOutlined />}
            disabled={disableAdd}
          >
            {addBtnTxt}
          </Button>
        </>
      )}
    </Form.List>
  );
};

export default DynamicFormItem;
