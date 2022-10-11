import axios from 'axios';
import apiRoot from './util/apiRoot';

export const getAllProductCatalogues = async () => {
  return axios.get(`${apiRoot}/productcatalogue/all`).then((res) => res.data);
};
