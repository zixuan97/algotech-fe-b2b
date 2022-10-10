import axios from 'axios';
import { NewUserType } from '../components/account/RequestAccountModal';
import { User } from '../models/types';
import apiRoot from './util/apiRoot';

export const getUserDetailsSvc = async (userId: string): Promise<User> => {
  return axios.get(`${apiRoot}/user/details/${userId}`).then((res) => res.data);
};

export const editUserSvc = async (user: User): Promise<any> => {
  return axios.put(`${apiRoot}/user`, user).then((res) => res.data);
};

export const requestB2BUserSvc = async (user: NewUserType): Promise<any> => {
  return axios.post(`${apiRoot}/user`, user).then((res) => res.data);
};

export const updatePasswordSvc = async (
  userEmail: string,
  currentPassword: string,
  newPassword: string
): Promise<any> => {
  return axios
    .post(`${apiRoot}/user/updatepw`, {
      userEmail,
      currentPassword,
      newPassword
    })
    .then((res) => res.data);
};

export const forgetPasswordSvc = async (recipientEmail: string): Promise<any> => {
  return axios
    .post(`${apiRoot}/user/forgetpw`, { recipientEmail })
    .then((res) => res.data);
};