import { Reducer } from 'react';
import { setAuthToken } from '../../utils/authUtils';
import { AuthStateAttr, AuthAction, AuthActionTypes } from './authTypes';

const authReducer: Reducer<AuthStateAttr, AuthAction> = (
  state: AuthStateAttr,
  action: AuthAction
): AuthStateAttr => {
  switch (action.type) {
    case AuthActionTypes.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    case AuthActionTypes.LOGIN_SUCCESS:
      // set token into diff locations based on whether remember me flag is set
      state.rmbMe
        ? localStorage.setItem('token', action.payload.token)
        : sessionStorage.setItem('token', action.payload.token);
      setAuthToken(action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false
      };
    case AuthActionTypes.AUTH_ERROR:
    case AuthActionTypes.LOGIN_FAIL:
    case AuthActionTypes.LOGOUT:
      state.rmbMe
        ? localStorage.removeItem('token')
        : sessionStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    case AuthActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    case AuthActionTypes.TOGGLE_RMB_ME:
      return {
        ...state,
        rmbMe: !state.rmbMe
      };
    default:
      return state;
  }
};

export default authReducer;
