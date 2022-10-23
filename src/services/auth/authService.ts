/**
 * Used to make all API calls to authentication services
 */
import axios from 'axios';
import { User } from 'src/models/types';
import apiRoot from '../util/apiRoot';

const loginUser = (email: string, password: string) => {};

export const getUserSvc = async (): Promise<User> => {
  return axios.get(`${apiRoot}/user`).then((res) => res.data);
};
