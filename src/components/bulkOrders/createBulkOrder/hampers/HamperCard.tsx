import {
  Button,
  Card,
  Divider,
  Empty,
  Input,
  List,
  Space,
  Typography
} from 'antd';
import React from 'react';
import ConfirmationModalButton from '../../../common/ConfirmationModalButton';
import {
  calculateSalesOrderAmt,
  Hamper,
  isHamperEmpty
} from '../../bulkOrdersHelper';
import CatalogueModal from '../catalogue/CatalogueModal';
import '../../../../styles/common/common.scss';
import '../../../../styles/pages/bulkOrder.scss';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';

const { Text } = Typography;

type HamperCardProps = {
  hamper: Hamper;
  updateHamper: (hamper: Hamper) => void;
  deleteHamper: (id: string) => void;
  checkDuplicateHamperName: (hamperName: string) => boolean;
};

const HamperCard = ({
  hamper,
  updateHamper,
  deleteHamper,
  checkDuplicateHamperName
}: HamperCardProps) => {
  const { isNewAdded } = hamper;
  const [editHamper, setEditHamper] = React.useState<Hamper>(hamper);

  const [catalogueModalOpen, setCatalogueModalOpen] =
    React.useState<boolean>(false);
  const [inEditMode, setInEditMode] = React.useState<boolean>(!!isNewAdded);
  const [error, setError] = React.useState<AlertType | null>(null);
  return (
    <Card
      title={
        <div className='container-spaced-out'>
          {inEditMode ? (
            <div className='hamper-name-input'>
              <div className='hamper-name-label'>
                <Text style={{ fontSize: 14, fontWeight: 'normal' }}>
                  Hamper Name
                </Text>
              </div>
              <Input
                value={editHamper.hamperName}
                onChange={(e) =>
                  setEditHamper((prev) => ({
                    ...prev,
                    hamperName: e.target.value
                  }))
                }
              />
              {!hamper.isNewAdded && (
                <ConfirmationModalButton
                  modalProps={{
                    title: 'Delete Hamper',
                    body: 'Are you sure you want to delete this hamper?',
                    onConfirm: () => deleteHamper(editHamper.id)
                  }}
                  danger
                >
                  Delete Hamper
                </ConfirmationModalButton>
              )}
            </div>
          ) : (
            editHamper.hamperName
          )}
        </div>
      }
      style={{ marginBottom: 8 }}
    >
      <CatalogueModal
        open={catalogueModalOpen}
        toggleOpen={setCatalogueModalOpen}
        hamperItems={editHamper.hamperItems}
        updateHamperItems={(newHamperItems) =>
          setEditHamper((prev) => ({ ...prev, hamperItems: newHamperItems }))
        }
      />
      <TimeoutAlert alert={error} clearAlert={() => setError(null)} />
      {editHamper.hamperItems.length > 0 ? (
        <List
          dataSource={editHamper.hamperItems}
          header='Products in Hamper'
          renderItem={(item, index) => (
            <List.Item style={{ marginBottom: 8 }}>
              <List.Item.Meta
                avatar={<Text>{`${index + 1}.`}</Text>}
                title={`${item.quantity}x ${item.productName}`}
                description={
                  <Space direction='vertical'>
                    <Text type='secondary'>{`Price per unit: $${item.price.toFixed(
                      2
                    )}`}</Text>
                    <Text>{`Total price: $${(
                      item.price * item.quantity
                    ).toFixed(2)}`}</Text>
                  </Space>
                }
                style={{ marginBottom: 8 }}
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description='No products added yet.'
          style={{ padding: '1.5em 0' }}
        />
      )}
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {inEditMode && (
          <Button block onClick={() => setCatalogueModalOpen(true)}>
            View Product Catalogue
          </Button>
        )}
        <div>
          <Divider orientation='left' orientationMargin={0}>
            {editHamper.hamperItems.length > 0 && 'Hamper Total'}
          </Divider>
          {editHamper.hamperItems.length > 0 && (
            <Text>{`$${calculateSalesOrderAmt(editHamper.hamperItems).toFixed(
              2
            )}`}</Text>
          )}
          <Space style={{ float: 'right' }}>
            {inEditMode ? (
              <>
                <Button
                  style={{ width: '10em' }}
                  onClick={() => {
                    if (isHamperEmpty(editHamper)) {
                      deleteHamper(editHamper.id);
                    } else {
                      setEditHamper(hamper);
                      setInEditMode(false);
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  style={{ width: '10em' }}
                  onClick={() => {
                    if (checkDuplicateHamperName(editHamper.hamperName)) {
                      setError({
                        type: 'error',
                        message: 'Hamper name already exists!'
                      });
                      return;
                    }
                    if (isNewAdded) {
                      updateHamper({ ...editHamper, isNewAdded: false });
                    } else {
                      updateHamper(editHamper);
                    }
                    setInEditMode(false);
                  }}
                  disabled={isHamperEmpty(editHamper)}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button
                type='primary'
                style={{ width: '10em' }}
                onClick={() => {
                  setInEditMode(true);
                  setEditHamper(hamper);
                }}
              >
                Edit
              </Button>
            )}
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default HamperCard;
