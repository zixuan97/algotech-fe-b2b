import axios from 'axios';
import { BulkOrder, PaymentMode } from 'src/models/types';
import apiRoot from './util/apiRoot';

type CreateBulkOrderRes = {
  paymentUrl: string;
  bulkOrder: BulkOrder;
};

type GeneratePaymentLinkReq = {
  paymentMode: PaymentMode;
  orderId: string;
};

type GeneratePaymentLinkRes = {
  data: string;
};

export const createBulkOrder = async (
  bulkOrder: BulkOrder
): Promise<CreateBulkOrderRes> => {
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

export const generatePaymentLink = async (
  paymentLinkReq: GeneratePaymentLinkReq
): Promise<GeneratePaymentLinkRes> => {
  return axios.post(`${apiRoot}/payment/link`, paymentLinkReq);
};
