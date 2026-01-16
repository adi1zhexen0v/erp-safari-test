import { useEffect, useRef, useState } from "react";
import { useGetMeQuery } from "@/features/auth/api";
import { logout, setAuth } from "@/features/auth/slice";
import { Loader } from "@/shared/components";
import { useAppDispatch } from "@/shared/hooks";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const initialLoadRef = useRef(true);

  const { data, isError, isLoading, isSuccess } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [isAuthResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setAuth(data));
      setAuthResolved(true);
      initialLoadRef.current = false;
    }

    if (isError && !isLoading) {
      if (initialLoadRef.current) {
        if (import.meta.env.DEV) {
          console.warn("[Auth] getMe failed on initial load. Possible Safari ITP / third-party cookie issue");
        }
        initialLoadRef.current = false;
      }
      dispatch(logout());
      setAuthResolved(true);
    }
  }, [isSuccess, isError, data, dispatch, isLoading]);

  if (!isAuthResolved || isLoading) {
    return <Loader isFullPage />;
  }

  return children;
}

