import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { checkDuplicateHamperName, Hamper } from '../../bulkOrdersHelper';
import HamperCard from './HamperCard';
import { v4 as uuidv4 } from 'uuid';

type HampersProps = {
  hampers: Hamper[];
  updateHampers: (hampers: Hamper[]) => void;
};

const Hampers = ({ hampers, updateHampers }: HampersProps) => {
  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      {hampers.map((hamper) => (
        <HamperCard
          key={hamper.id}
          hamper={hamper}
          updateHamper={(newHamper) =>
            updateHampers(
              hampers.map((hamper) =>
                hamper.id === newHamper.id ? newHamper : hamper
              )
            )
          }
          deleteHamper={(id) =>
            updateHampers(hampers.filter((hamper) => hamper.id !== id))
          }
          checkDuplicateHamperName={(hamperName) =>
            checkDuplicateHamperName(hampers, hamperName)
          }
        />
      ))}
      <Button
        type='dashed'
        block
        icon={<PlusOutlined />}
        disabled={hampers.some((hamper) => hamper.isNewAdded)}
        onClick={() =>
          updateHampers([
            ...hampers,
            {
              id: uuidv4(),
              hamperName: '',
              hamperItems: [],
              isNewAdded: true
            }
          ])
        }
      >
        Add Hamper
      </Button>
    </Space>
  );
};

export default Hampers;
