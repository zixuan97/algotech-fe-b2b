import CatalogueContent, {
  CatalogueContentMode
} from 'src/components/bulkOrders/createBulkOrder/catalogue/CatalogueContent';

const Catalogue = () => {
  return (
    <CatalogueContent catalogueContentMode={CatalogueContentMode.DISPLAY} />
  );
};

export default Catalogue;
