import React, { useContext, ReactNode } from "react";
import { Route, Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? (
    <Route element={<Outlet />}></Route>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
