import { createContext } from 'react';
import { AuthStateInit } from './authTypes';

const authContext = createContext({
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  user: null,
  error: null
} as AuthStateInit);

export default authContext;
