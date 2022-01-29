import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSWRConfig } from "swr";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { AuthContext } from "app/context/auth-context";
import { axios } from "app/lib/axios";
import { magic } from "app/lib/magic";
import { mixpanel } from "app/lib/mixpanel";
import { deleteCache } from "app/lib/delete-cache";
import { deleteRefreshToken } from "app/lib/refresh-token";
import { deleteAccessToken, getAccessToken } from "app/lib/access-token";
import * as loginStorage from "app/lib/login";
import * as logoutStorage from "app/lib/logout";
import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { useWeb3 } from "app/hooks/use-web3";
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
  const connector = useWalletConnect();
  const { setWeb3 } = useWeb3();
  const { setTokens, refreshTokens } = useAccessTokenManager();
  //#endregion

  //#region methods
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
        loginStorage.setLogin(Date.now().toString());
        setAuthenticationStatus("AUTHENTICATED");
        return;
      }

      setAuthenticationStatus("UNAUTHENTICATED");
      throw "Login failed";
    },
    [setTokens, setAuthenticationStatus]
  );
  /**
   * Log out the customer if logged in, and clear auth cache.
   */
  const logout = useCallback(
    async function logout() {
      const wasUserLoggedIn = loginStorage.getLogin();

      if (wasUserLoggedIn && wasUserLoggedIn.length > 0) {
        magic.user.logout();
        mixpanel.track("Logout");

        loginStorage.deleteLogin();
        logoutStorage.setLogout(Date.now().toString());
      }

      deleteCache();
      deleteRefreshToken();
      deleteAccessToken();

      if (wasUserLoggedIn) {
        await mutate(null);
        if (connector && connector.killSession) {
          await connector.killSession();
        }
      }

      setWeb3(undefined);
      setAuthenticationStatus("UNAUTHENTICATED");
    },
    [connector]
  );
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
        await logout();
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
