import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

type AuthRouteProps = {
  children: JSX.Element;
  redirectTo: string;
};

const AuthRoute = ({ children, redirectTo }: AuthRouteProps): JSX.Element => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;
  //TODO: set back conditional rendering to be based on isAuthenticated
  return true ? children : <Navigate to={redirectTo} />;
};

export default AuthRoute;
