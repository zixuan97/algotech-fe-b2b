import axios from 'axios';
import { BulkOrder } from 'src/models/types';
import apiRoot from './util/apiRoot';

export const createBulkOrder = async (
  bulkOrder: BulkOrder
): Promise<BulkOrder> => {
  return axios.post(`${apiRoot}/bulkOrder`, bulkOrder).then((res) => res.data);
};

export const getBulkOrdersByEmail = async (
  email: string
): Promise<BulkOrder[]> => {
  return axios
    .get(`${apiRoot}/bulkOrder/email/${email}`)
    .then((res) => res.data);
};

export const getBulkOrderByOrderId = async (
  orderId: string
): Promise<BulkOrder> => {
  return axios
    .get(`${apiRoot}/bulkOrder/orderId/${orderId}`)
    .then((res) => res.data);
};
