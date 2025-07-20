import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks";
import React from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAppSelector((state) => state.auth);
  return user ? children : <Navigate to="/" replace />;
};

export default React.memo(ProtectedRoute);
