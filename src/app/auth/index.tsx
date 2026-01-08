import { useEffect, useState } from "react";
import { useGetMeQuery } from "@/features/auth/api";
import { logout, setAuth } from "@/features/auth/slice";
import { Loader } from "@/shared/components";
import { useAppDispatch } from "@/shared/hooks";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  const { data, isError, isLoading, isSuccess } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [isAuthResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setAuth(data));
      setAuthResolved(true);
    }

    if (isError) {
      dispatch(logout());
      setAuthResolved(true);
    }
  }, [isSuccess, isError, data, dispatch]);

  if (!isAuthResolved || isLoading) {
    return <Loader isFullPage />;
  }

  return children;
}

