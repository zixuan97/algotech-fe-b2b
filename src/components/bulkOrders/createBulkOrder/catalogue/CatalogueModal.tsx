import { Modal } from 'antd';
import React from 'react';
import {
  BundleCatalogue,
  ProductCatalogue,
  SalesOrderItem
} from '../../../../models/types';
import { convertCatalogueToSalesOrderItem } from '../../bulkOrdersHelper';
import CatalogueContent, { CatalogueContentMode } from './CatalogueContent';

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
  const [editHamperItemsMap, setEditHamperItemsMap] = React.useState<
    Map<string, SalesOrderItem>
  >(
    new Map<string, SalesOrderItem>(
      hamperItems.map((hamperItem) => [hamperItem.productName, hamperItem])
    )
  );

  const updateEditHamperItems = (
    catalogue: ProductCatalogue | BundleCatalogue,
    quantity: number
  ) => {
    const productName =
      (catalogue as ProductCatalogue).product?.name ??
      (catalogue as BundleCatalogue).bundle?.name;

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
      <CatalogueContent
        catalogueContentMode={CatalogueContentMode.EDIT}
        hamperItemsMap={editHamperItemsMap}
        updateHamperItems={updateEditHamperItems}
      />
    </Modal>
  );
};

export default CatalogueModal;
