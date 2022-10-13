import axios from 'axios';
import { BulkOrder } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const createBulkOrder = async (
  bulkOrder: BulkOrder
): Promise<BulkOrder> => {
  return axios.post(`${apiRoot}/bulkOrder`, bulkOrder).then((res) => res.data);
};
