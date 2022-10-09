import { Button, Space, Typography } from 'antd';
import React from 'react';
import TextArea from 'antd/lib/input/TextArea';

const { Text } = Typography;

type MessageTemplateProps = {
  msgTmpl: string;
  updateMsgTmpl: (msgTmpl: string) => void;
};

const MessageTemplate = ({ msgTmpl, updateMsgTmpl }: MessageTemplateProps) => {
  const [showEditMsg, setShowEditMsg] = React.useState<boolean>(false);
  const [editMsgTmpl, setEditMsgTmpl] = React.useState<string>(msgTmpl);
  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      {(msgTmpl || showEditMsg) &&
        (showEditMsg ? (
          <>
            <TextArea
              rows={5}
              value={editMsgTmpl}
              onChange={(e) => setEditMsgTmpl(e.target.value)}
            />
            <Space style={{ float: 'right', marginTop: 2 }}>
              <Button
                onClick={() => {
                  setEditMsgTmpl(msgTmpl);
                  setShowEditMsg(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type='primary'
                onClick={() => {
                  updateMsgTmpl(editMsgTmpl);
                  setShowEditMsg(false);
                }}
              >
                Save
              </Button>
            </Space>
          </>
        ) : (
          <Text>{msgTmpl}</Text>
        ))}
      {!showEditMsg && (
        <Button type='primary' onClick={() => setShowEditMsg(true)}>
          {`${editMsgTmpl ? 'Edit' : 'Add'} Message Template`}
        </Button>
      )}
    </Space>
  );
};

export default MessageTemplate;
