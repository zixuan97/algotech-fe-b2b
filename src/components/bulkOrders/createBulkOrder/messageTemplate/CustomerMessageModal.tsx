import { Modal, Typography } from 'antd';
import '../../../../styles/pages/bulkOrder.scss';
import { generateMsgTmpl, HamperOrdersFormItem } from '../../bulkOrdersHelper';
import { MsgTmpl } from './MessageTemplate';

const { Text } = Typography;

type CustomerMessageModalProps = {
  open: boolean;
  msgTmpl: MsgTmpl;
  hamperOrderFormItem?: HamperOrdersFormItem;
  onClose: () => void;
};

const CustomerMessageModal = ({
  open,
  msgTmpl,
  hamperOrderFormItem,
  onClose
}: CustomerMessageModalProps) => {
  console.log(hamperOrderFormItem);
  return (
    <>
      <Modal
        open={open}
        footer={null}
        title='Preview Message'
        onCancel={onClose}
      >
        <div>
          <Text>
            {hamperOrderFormItem &&
              generateMsgTmpl(hamperOrderFormItem, msgTmpl)}
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default CustomerMessageModal;
