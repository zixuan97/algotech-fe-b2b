import axios from 'axios';
import { BundleCatalogue, ProductCatalogue } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const getAllProductCatalogues = async (): Promise<
  ProductCatalogue[]
> => {
  return axios.get(`${apiRoot}/productCatalogue/all`).then((res) => res.data);
};

export const getAllBundleCatalogues = async (): Promise<BundleCatalogue[]> => {
  return axios.get(`${apiRoot}/bundleCatalogue/all`).then((res) => res.data);
};
