import axios from 'axios';
import { User } from '../models/types';
import apiRoot from './util/apiRoot';

export const getUserDetailsSvc = (userId: string): Promise<User> => {
  return axios.get(`${apiRoot}/user/details/${userId}`).then((res) => res.data);
};

export const editUserSvc = (user: User): Promise<any> => {
  return axios.put(`${apiRoot}/user`, user).then((res) => res.data);
};
