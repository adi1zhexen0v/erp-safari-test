import { type JSX } from "react";
import { Navigate } from "react-router";
import { useAppSelector } from "@/shared/hooks";
import { LOGIN_PAGE_ROUTE } from "@/shared/utils";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  // const isAuth = true;

  if (!isAuth) {
    return <Navigate to={LOGIN_PAGE_ROUTE} replace />;
  }

  return children;
}
