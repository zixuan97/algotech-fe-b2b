import { Button, Card, Empty } from 'antd';

const HamperCard = () => {
  return (
    <Card title='Hamper 1'>
      <Empty
        description='No products added yet.'
        style={{ padding: '1.5em 0' }}
      />
      <Button block>View Product Catalogue</Button>
    </Card>
  );
};

export default HamperCard;
