import axios from 'axios';
import { BulkOrder } from 'src/models/types';
import apiRoot from './util/apiRoot';

export type BulkOrderRes = {
  paymentUrl: string;
  bulkOrder: BulkOrder;
};

export const getPaymentForBulkOrder = async (
  bulkOrder: BulkOrder
): Promise<BulkOrderRes> => {
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
