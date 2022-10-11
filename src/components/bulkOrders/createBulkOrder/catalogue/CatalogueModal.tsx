import { SearchOutlined } from '@ant-design/icons';
import {
  Col,
  Empty,
  Input,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Row,
  Space
} from 'antd';
import React from 'react';
import {
  BundleCatalogue,
  ProductCatalogue,
  SalesOrderItem
} from '../../../../models/types';
import { getAllProductCatalogues } from '../../../../services/catalogueService';
import asyncFetchCallback from '../../../../services/util/asyncFetchCallback';
import { convertCatalogueToSalesOrderItem } from '../../bulkOrdersHelper';
import CatalogueCard from './CatalogueCard';

const { Sider, Content } = Layout;

type CatalogueDisplayType = 'PRODUCTS' | 'BUNDLES';

type CatalogueModalProps = {
  open: boolean;
  toggleOpen: (open: boolean) => void;
  hamperItems: SalesOrderItem[];
  updateHamperItems: (hamperItems: SalesOrderItem[]) => void;
};

const CatalogueModal = ({
  open,
  toggleOpen,
  hamperItems,
  updateHamperItems
}: CatalogueModalProps) => {
  const [catalogueDisplayType, setCatalogueDisplayType] =
    React.useState<CatalogueDisplayType>('PRODUCTS');
  const [productCatalogue, setProductCatalogue] = React.useState<
    ProductCatalogue[]
  >([]);
  const [bundleCatalogue, setBundleCatalogue] = React.useState<
    BundleCatalogue[]
  >([]);
  const [searchField, setSearchField] = React.useState<string>('');

  const [editHamperItemsMap, setEditHamperItemsMap] = React.useState<
    Map<string, SalesOrderItem>
  >(
    new Map<string, SalesOrderItem>(
      hamperItems.map((hamperItem) => [hamperItem.productName, hamperItem])
    )
  );

  const filteredData = React.useMemo(
    () =>
      catalogueDisplayType === 'PRODUCTS'
        ? productCatalogue.filter((product) =>
            product.product.name.includes(searchField)
          )
        : bundleCatalogue.filter((bundle) =>
            bundle.bundle.name.includes(searchField)
          ),
    [searchField, catalogueDisplayType, productCatalogue, bundleCatalogue]
  );

  React.useEffect(() => {
    asyncFetchCallback(getAllProductCatalogues(), setProductCatalogue);
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

  const updateEditHamperItems = (
    catalogue: ProductCatalogue | BundleCatalogue,
    quantity: number
  ) => {
    const productName =
      (catalogue as ProductCatalogue).product.name ??
      (catalogue as BundleCatalogue).bundle.name;

    if (quantity > 0) {
      const newHamperItem = convertCatalogueToSalesOrderItem(
        catalogue,
        quantity
      );
      setEditHamperItemsMap(
        (prev) => new Map(prev.set(productName, newHamperItem))
      );
    } else {
      setEditHamperItemsMap((prev) => {
        const newMap = new Map(prev);
        newMap.delete(productName);
        return new Map(newMap);
      });
    }
  };

  return (
    <Modal
      open={open}
      title='Product Catalogue'
      width='80%'
      onCancel={() => toggleOpen(false)}
      onOk={() => {
        updateHamperItems([...editHamperItemsMap.values()]);
        toggleOpen(false);
      }}
    >
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
                        catalogue={product}
                        quantity={
                          editHamperItemsMap.get(product.product.name)?.quantity
                        }
                        updateHamperItem={updateEditHamperItems}
                      />
                    </Col>
                  ))
                ) : (
                  (filteredData as BundleCatalogue[]).map((bundle) => (
                    <Col span={8}>
                      <CatalogueCard
                        catalogue={bundle}
                        quantity={
                          editHamperItemsMap.get(bundle.bundle.name)?.quantity
                        }
                        updateHamperItem={updateEditHamperItems}
                      />
                    </Col>
                  ))
                )
              ) : (
                <Col span={24}>
                  <Empty
                    className='container-center-col'
                    description={`No ${catalogueDisplayType.toLowerCase()} to display.`}
                  />
                </Col>
              )}
            </Row>
          </Space>
        </Content>
      </Layout>
    </Modal>
  );
};

export default CatalogueModal;
