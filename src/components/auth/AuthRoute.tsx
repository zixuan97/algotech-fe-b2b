import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

type AuthRouteProps = {
  children: JSX.Element;
  redirectTo: string;
  unverifiedRedirect?: string;
};

const AuthRoute = ({
  children,
  redirectTo,
  unverifiedRedirect
}: AuthRouteProps): JSX.Element => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;
  const verified = user?.isVerified ?? true;

  if (isAuthenticated) {
    if (unverifiedRedirect) {
      return verified ? children : <Navigate to={unverifiedRedirect} />;
    } else {
      return children;
    }
  } else {
    return <Navigate to={redirectTo} />;
  }
};

export default AuthRoute;
