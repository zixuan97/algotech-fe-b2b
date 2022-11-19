import { Modal, Typography } from 'antd';
import React from 'react';
import '../../../../styles/pages/bulkOrder.scss';

const { Text } = Typography;

type CustomerMessageModalProps = {
  open: boolean;
  message: string;
  onClose: () => void;
};

const CustomerMessageModal = (props: CustomerMessageModalProps) => {
  const { open, message, onClose } = props;

  return (
    <>
      <Modal
        open={open}
        footer={null}
        title='Preview Message'
        onCancel={onClose}
      >
        <div>
          <Text>{message}</Text>
        </div>
      </Modal>
    </>
  );
};

export default CustomerMessageModal;
