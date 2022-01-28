import React, { useCallback, useEffect, useMemo, useState } from "react";

import useSWR from "swr";
import useUnmountSignal from "use-unmount-signal";
import { axios } from "app/lib/axios";
import { UserContext } from "app/context/user-context";
import { useAuth } from "app/hooks/auth/use-auth";

interface UserProviderProps {
  children: React.ReactNode;
}

const API_URL = "/v2/myinfo";

export function UserProvider({ children }: UserProviderProps) {
  //#region hooks
  const { authenticationStatus, accessToken } = useAuth();
  const unmountSignal = useUnmountSignal();
  const { data, error, mutate } = useSWR(accessToken ? API_URL : null, (url) =>
    axios({ url, method: "GET", unmountSignal })
  );
  //#endregion

  //#region variables
  const isLoading =
    authenticationStatus === "IDLE" ||
    authenticationStatus === "REFRESHING" ||
    (authenticationStatus === "AUTHENTICATED" && !error && !data);
  const userContextValue = useMemo(
    () => ({
      user: data,
      error,
      isLoading,
      isAuthenticated: accessToken != undefined,
    }),
    [isLoading, data, accessToken]
  );
  //#endregion

  //#region effects
  useEffect(() => {
    if (
      authenticationStatus === "AUTHENTICATED" ||
      authenticationStatus === "UNAUTHENTICATED"
    ) {
      mutate();
    }
  }, [authenticationStatus, mutate]);
  //#endregion
  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}
