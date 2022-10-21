import { SearchOutlined } from '@ant-design/icons';
import {
  Col,
  Empty,
  Input,
  Layout,
  Menu,
  MenuProps,
  Row,
  Space,
  Spin
} from 'antd';
import React from 'react';
import {
  BundleCatalogue,
  ProductCatalogue,
  SalesOrderItem
} from 'src/models/types';
import {
  getAllBundleCatalogues,
  getAllProductCatalogues
} from 'src/services/catalogueService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import CatalogueCard from './CatalogueCard';
import '../../../../styles/common/common.scss';

export type CatalogueDisplayType = 'PRODUCTS' | 'BUNDLES';
export enum CatalogueContentMode {
  DISPLAY,
  EDIT
}

const { Sider, Content } = Layout;

type CatalogueContentProps = {
  catalogueContentMode: CatalogueContentMode;
  hamperItemsMap?: Map<string, SalesOrderItem>;
  updateHamperItems?: (
    catalogue: ProductCatalogue | BundleCatalogue,
    quantity: number
  ) => void;
};

const CatalogueContent = ({
  catalogueContentMode,
  hamperItemsMap,
  updateHamperItems: updateEditHamperItems
}: CatalogueContentProps) => {
  const [catalogueDisplayType, setCatalogueDisplayType] =
    React.useState<CatalogueDisplayType>('PRODUCTS');
  const [productCatalogue, setProductCatalogue] = React.useState<
    ProductCatalogue[]
  >([]);
  const [bundleCatalogue, setBundleCatalogue] = React.useState<
    BundleCatalogue[]
  >([]);
  const [searchField, setSearchField] = React.useState<string>('');
  const [productsLoading, setProductsLoading] = React.useState<boolean>(false);
  const [bundlesLoading, setBundlesLoading] = React.useState<boolean>(false);

  const filteredData = React.useMemo(
    () =>
      catalogueDisplayType === 'PRODUCTS'
        ? productCatalogue.filter((product) =>
            product.product.name
              .toLowerCase()
              .includes(searchField.toLowerCase())
          )
        : bundleCatalogue.filter((bundle) =>
            bundle.bundle.name.toLowerCase().includes(searchField.toLowerCase())
          ),
    [searchField, catalogueDisplayType, productCatalogue, bundleCatalogue]
  );

  React.useEffect(() => {
    setProductsLoading(true);
    setBundlesLoading(true);
    asyncFetchCallback(
      getAllProductCatalogues(),
      setProductCatalogue,
      () => void 0,
      { updateLoading: setProductsLoading }
    );
    asyncFetchCallback(
      getAllBundleCatalogues(),
      setBundleCatalogue,
      () => void 0,
      { updateLoading: setBundlesLoading }
    );
  }, []);

  const menuItems: MenuProps['items'] = [
    {
      label: 'Products',
      key: 'PRODUCTS'
    },
    {
      label: 'Bundles',
      key: 'BUNDLES'
    }
  ];

  return (
    <Layout>
      <Sider width='15%'>
        <Menu
          style={{ height: '100%' }}
          items={menuItems}
          selectedKeys={[catalogueDisplayType]}
          onClick={({ key }) =>
            setCatalogueDisplayType(key as CatalogueDisplayType)
          }
        />
      </Sider>
      <Content
        style={{
          padding: '0 24px',
          minHeight: 280,
          background: '#fff',
          overflow: 'auto',
          maxHeight: '70vh'
        }}
      >
        <Space size='large' direction='vertical' style={{ width: '100%' }}>
          <Space>
            <Input
              placeholder='Search'
              size='large'
              style={{ width: '25rem' }}
              suffix={<SearchOutlined />}
              onChange={(e) => setSearchField(e.target.value)}
            />
          </Space>
          <Row gutter={[24, 24]}>
            {filteredData.length > 0 ? (
              catalogueDisplayType === 'PRODUCTS' ? (
                (filteredData as ProductCatalogue[]).map((product) => (
                  <Col key={product.id} span={8}>
                    <CatalogueCard
                      catalogueContentMode={catalogueContentMode}
                      catalogue={product}
                      quantity={
                        hamperItemsMap?.get(product.product.name)?.quantity
                      }
                      updateHamperItem={updateEditHamperItems}
                    />
                  </Col>
                ))
              ) : (
                (filteredData as BundleCatalogue[]).map((bundle) => (
                  <Col key={bundle.id} span={8}>
                    <CatalogueCard
                      catalogueContentMode={catalogueContentMode}
                      catalogue={bundle}
                      quantity={
                        hamperItemsMap?.get(bundle.bundle.name)?.quantity
                      }
                      updateHamperItem={updateEditHamperItems}
                    />
                  </Col>
                ))
              )
            ) : (
              <Col span={24}>
                {(catalogueDisplayType === 'PRODUCTS' && productsLoading) ||
                (catalogueDisplayType === 'BUNDLES' && bundlesLoading) ? (
                  <Spin size='large' className='container-center-full' />
                ) : (
                  <Empty
                    className='container-center-col'
                    description={`No ${catalogueDisplayType.toLowerCase()} to display.`}
                  />
                )}
              </Col>
            )}
          </Row>
        </Space>
      </Content>
    </Layout>
  );
};

export default CatalogueContent;
