import { useReducer, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import { AuthActionTypes, AuthStateAttr } from './authTypes';
import { PropsWithChildren } from 'react';
import { getAxiosErrorMsg } from '../../utils/errorUtils';
import { UserInput } from '../../pages/Login';
import apiRoot from '../../services/util/apiRoot';
import useNext from '../../hooks/useNext';
import { setAuthToken } from 'src/utils/authUtils';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getUserSvc } from 'src/services/auth/authService';
import { User } from 'src/models/types';

const AuthState = (props: PropsWithChildren) => {
  const initialState: AuthStateAttr = {
    token: sessionStorage.getItem('token') ?? localStorage.getItem('token'),
    isAuthenticated: !!(
      sessionStorage.getItem('token') ?? localStorage.getItem('token')
    ),
    rmbMe: true,
    user: null,
    error: null
  };

  useEffect(() => {
    if (initialState.token) {
      loadUser();
    }
  }, [initialState.token]);

  const [state, dispatch] = useReducer(authReducer, initialState);
  const nextState = useNext(state);
  // load user - check which user is logged in and get user data
  const loadUser = async () => {
    const token =
      sessionStorage.getItem('token') ?? localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }

    asyncFetchCallback(
      getUserSvc(),
      (user: User) => {
        if (user.status !== 'DISABLED' && user.status !== 'REJECTED') {
          dispatch({
            type: AuthActionTypes.USER_LOADED,
            payload: user
          });
        } else {
          dispatch({ type: AuthActionTypes.AUTH_ERROR });
        }
      },
      () => dispatch({ type: AuthActionTypes.AUTH_ERROR })
    );
  };

  // login user
  const login = async (userInput: UserInput) => {
    try {
      const res = await axios.post(`${apiRoot}/user/auth`, userInput, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: res.data
      });
      // added to await state changes before proceeding to next action
      await nextState();
      loadUser();
    } catch (e) {
      dispatch({
        type: AuthActionTypes.LOGIN_FAIL,
        payload: getAxiosErrorMsg(e)
      });
    }
  };

  // logout - destroy the token
  const logout = () => dispatch({ type: AuthActionTypes.LOGOUT });

  // clear errors
  const clearErrors = () => dispatch({ type: AuthActionTypes.CLEAR_ERRORS });

  const toggleRmbMe = () => dispatch({ type: AuthActionTypes.TOGGLE_RMB_ME });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        rmbMe: state.rmbMe,
        user: state.user,
        error: state.error,
        loadUser,
        login,
        logout,
        clearErrors,
        toggleRmbMe
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
