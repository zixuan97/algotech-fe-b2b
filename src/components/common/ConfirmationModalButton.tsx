import { Button, ButtonProps, Modal } from 'antd';
import React, { PropsWithChildren } from 'react';

type ConfirmationModalProps = {
  title: string;
  body: React.ReactNode;
  onConfirm: () => void;
  onClose?: () => void;
};

type ConfirmationModalButtonProps = {
  modalProps: ConfirmationModalProps;
};

/**
 * Use this button to replace the regular button when you want a confirmation modal to pop up before proceeding with the action.
 * The opening and closing of the modal is handled within this component itself
 * @param modalProps: props required for the confirmation modal
 * @param buttonTxt: the text to display within the button
 * @param buttonProps: all props that can be used with a regular ant design button
 */
const ConfirmationModalButton = ({
  modalProps,
  children,
  ...buttonProps
}: ConfirmationModalButtonProps &
  Omit<ButtonProps, 'onClick'> &
  PropsWithChildren) => {
  const { title, body, onConfirm, onClose } = modalProps;
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={() => {
          onConfirm();
          setOpen(false);
        }}
        onCancel={() => {
          onClose?.();
          setOpen(false);
        }}
      >
        {body}
      </Modal>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {children}
      </Button>
    </>
  );
};

export default ConfirmationModalButton;
