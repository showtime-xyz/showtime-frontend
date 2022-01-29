import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import { AuthContext } from "app/context/auth-context";
import { axios } from "app/lib/axios";
import { magic } from "app/lib/magic";
import { mixpanel } from "app/lib/mixpanel";
import { deleteCache } from "app/lib/delete-cache";
import { deleteRefreshToken } from "app/lib/refresh-token";
import { deleteAccessToken, getAccessToken } from "app/lib/access-token";
import { setLogin } from "app/lib/login";
import { setLogout } from "app/lib/logout";
import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { AuthenticationStatus } from "../types";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  //#region state
  const [authenticationStatus, setAuthenticationStatus] =
    useState<AuthenticationStatus>("IDLE");
  //#endregion

  //#region hooks
  const { mutate } = useSWRConfig();
  const { setTokens, refreshTokens } = useAccessTokenManager();
  //#endregion

  //#region login / logout
  const login = useCallback(
    async function login(endpoint: string, data: object) {
      const response = await axios({
        url: `/v1/${endpoint}`,
        method: "POST",
        data,
      });

      const accessToken = response?.access;
      const refreshToken = response?.refresh;
      const validResponse = accessToken && refreshToken;

      if (validResponse) {
        setTokens(accessToken, refreshToken);
        setLogin(Date.now().toString());
        setAuthenticationStatus("AUTHENTICATED");
        return;
      }

      setAuthenticationStatus("UNAUTHENTICATED");
      throw "Login failed";
    },
    [setTokens, setAuthenticationStatus]
  );
  const logout = useCallback(async function logout() {
    setAuthenticationStatus("UNAUTHENTICATED");
    magic.user.logout();

    deleteCache();
    deleteRefreshToken();
    deleteAccessToken();

    await mutate(null);
    // TODO(gorhom): move web3 context into a separate
    // provider.
    // connector.killSession();
    // setWeb3(null);
    mixpanel.track("Logout");
    // Triggers all event listeners for this key to fire. Used to force cross tab logout.
    setLogout(Date.now().toString());
  }, []);
  //#endregion

  //#region variables
  const accessToken = useMemo(
    () =>
      authenticationStatus === "AUTHENTICATED" ? getAccessToken() : undefined,
    [authenticationStatus]
  );
  const authenticationContextValue = useMemo(
    () => ({
      authenticationStatus,
      accessToken,

      setAuthenticationStatus,

      login,
      logout,
    }),
    [authenticationStatus, accessToken, setAuthenticationStatus, login, logout]
  );
  //#endregion

  //#region effects
  useEffect(() => {
    async function doRefreshToken() {
      setAuthenticationStatus("REFRESHING");
      try {
        await refreshTokens();
        setAuthenticationStatus("AUTHENTICATED");
      } catch (error) {
        console.error(error);
        logout();
      }
    }

    doRefreshToken();
  }, [logout, refreshTokens]);
  //#endregion
  return (
    <AuthContext.Provider value={authenticationContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
