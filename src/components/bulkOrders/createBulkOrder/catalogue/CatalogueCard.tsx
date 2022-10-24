import {
  Button,
  Card,
  Divider,
  Empty,
  Image,
  InputNumber,
  Space,
  Typography
} from 'antd';
import React from 'react';
import { toCurrencyString } from 'src/utils/utils';
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

const { Title, Text, Paragraph } = Typography;

type RenderParagraphProps = {
  paragraphText: string;
  maxRows: number;
};

const RenderParagraph = ({ paragraphText, maxRows }: RenderParagraphProps) => {
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [keyCount, setKeyCount] = React.useState<number>(0);

  const ellipsisOpen = () => {
    setExpanded(true);
    expanded && setKeyCount((prev) => prev + 1);
  };
  const ellipsisClose = () => {
    setExpanded(false);
    expanded && setKeyCount((prev) => prev + 1);
  };
  return (
    <div key={keyCount} style={{ minHeight: 50 }}>
      <Paragraph
        key={keyCount}
        ellipsis={{
          rows: maxRows,
          expandable: true,
          symbol: 'More',
          onExpand: () => ellipsisOpen()
        }}
      >
        {paragraphText}
      </Paragraph>
      {expanded && (
        <Button
          style={{ padding: 0 }}
          type='link'
          onClick={() => ellipsisClose()}
        >
          Close
        </Button>
      )}
    </div>
  );
};

const CatalogueCard = ({
  catalogueContentMode,
  catalogue,
  quantity = 0,
  updateHamperItem
}: CatalogueCardProps) => {
  const name =
    (catalogue as ProductCatalogue).product?.name ??
    (catalogue as BundleCatalogue).bundle?.name;
  const { price, image, description } = catalogue;
  const bundleProducts = (catalogue as BundleCatalogue)?.bundle?.bundleProduct;
  const [error, setError] = React.useState<boolean>(false);

  return (
    <Card
      bodyStyle={{
        minHeight: bundleProducts ? 720 : 550,
        display: 'flex',
        flexDirection: 'column'
        // justifyContent: 'space-between',
        // gap: '1em'
      }}
    >
      <div className='container-spaced-out-col' style={{ flex: 1 }}>
        <div>
          {image && !error ? (
            <Image src={image} height={300} onError={() => setError(true)} />
          ) : (
            <Empty
              className='container-center-col'
              style={{ height: 300 }}
              description='Image placeholder'
            />
          )}
          <Title level={3} style={{ marginTop: '0.5em' }}>
            {name}
          </Title>
          <RenderParagraph paragraphText={description} maxRows={2} />
          <Space direction='vertical'>
            {bundleProducts && description && <br />}
            {/* {bundleProducts && (
              <RenderParagraph
                paragraphText={bundleProducts.reduce(
                  (prev, curr) =>
                    `${prev}${curr.quantity}x ${curr.product.name}\n`,
                  ''
                )}
                maxRows={5}
              />
            )} */}
            {bundleProducts?.map((bundleProduct) => (
              <Text
                key={bundleProduct.product.name}
              >{`${bundleProduct.quantity}x ${bundleProduct.product.name}`}</Text>
            ))}
          </Space>
        </div>
        <div>
          <Divider />
          <div className='container-spaced-out'>
            <Text>{`Price: ${toCurrencyString(price)}`}</Text>
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
        </div>
      </div>
    </Card>
  );
};

export default CatalogueCard;
