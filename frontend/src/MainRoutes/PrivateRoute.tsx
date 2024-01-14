import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuth = useSelector((store: RootState) => store.authReducer.isAuth);
  // const isAdmin = useSelector((store: RootState) => store.authReducer.isAdmin);

  const location = useLocation();

  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        state={{ pathname: location.pathname }}
        replace={true}
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
