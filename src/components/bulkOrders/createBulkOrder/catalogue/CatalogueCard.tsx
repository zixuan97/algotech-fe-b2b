import {
  Card,
  Divider,
  Empty,
  Image,
  InputNumber,
  Space,
  Typography
} from 'antd';
import React from 'react';
import { BundleCatalogue, ProductCatalogue } from '../../../../models/types';
import '../../../../styles/common/common.scss';
import { CatalogueContentMode } from './CatalogueContent';

type CatalogueCardProps = {
  catalogueContentMode: CatalogueContentMode;
  catalogue: ProductCatalogue | BundleCatalogue;
  quantity?: number;
  updateHamperItem?: (
    catalogue: ProductCatalogue | BundleCatalogue,
    quantity: number
  ) => void;
};

const { Title, Text } = Typography;

const CatalogueCard = ({
  catalogueContentMode,
  catalogue,
  quantity = 0,
  updateHamperItem
}: CatalogueCardProps) => {
  const name =
    (catalogue as ProductCatalogue).product?.name ??
    (catalogue as BundleCatalogue).bundle?.name;
  const { price, image } = catalogue;
  const bundleProducts = (catalogue as BundleCatalogue)?.bundle?.bundleProduct;
  const [error, setError] = React.useState<boolean>(false);

  return (
    <Card>
      {image && !error ? (
        <Image src={image} height={300} onError={() => setError(true)} />
      ) : (
        <Empty
          className='container-center-col'
          style={{ height: 300 }}
          description='Image placeholder'
        />
      )}
      <Title level={3}>{name}</Title>
      <Space direction='vertical'>
        {bundleProducts?.map((bundleProduct) => (
          <Text
            key={bundleProduct.product.name}
          >{`${bundleProduct.quantity}x ${bundleProduct.product.name}`}</Text>
        ))}
      </Space>
      <Divider />
      <div className='container-spaced-out'>
        <Text>{`Price: $${price.toFixed(2)}`}</Text>
        {catalogueContentMode === CatalogueContentMode.EDIT && (
          <Space>
            <Text>Quantity:</Text>
            <InputNumber
              value={quantity}
              min={0}
              onChange={(value) => {
                if (value !== null) {
                  updateHamperItem?.(catalogue, value);
                }
              }}
            />
          </Space>
        )}
      </div>
    </Card>
  );
};

export default CatalogueCard;
