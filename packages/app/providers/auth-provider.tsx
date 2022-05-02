import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import { useSWRConfig } from "swr";

import { AuthContext } from "app/context/auth-context";
import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { useFetchOnAppForeground } from "app/hooks/use-fetch-on-app-foreground";
import { useWeb3 } from "app/hooks/use-web3";
import { deleteAccessToken, useAccessToken } from "app/lib/access-token";
import { track } from "app/lib/analytics";
import { deleteCache } from "app/lib/delete-cache";
import * as loginStorage from "app/lib/login";
import * as logoutStorage from "app/lib/logout";
import { magic } from "app/lib/magic";
import { mixpanel } from "app/lib/mixpanel";
import { deleteRefreshToken } from "app/lib/refresh-token";
import { rudder } from "app/lib/rudderstack";
import { useWalletConnect } from "app/lib/walletconnect";
import getWeb3Modal from "app/lib/web3-modal";
import { useRouter } from "app/navigation/use-router";

import type { AuthenticationStatus } from "../types";

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
  const fetchOnAppForeground = useFetchOnAppForeground();
  const router = useRouter();
  //#endregion

  //#region methods
  const login = useCallback(
    async function login(endpoint: string, data: object) {
      const response = await fetchOnAppForeground({
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
      if (Platform.OS === "web") {
        const web3Modal = await getWeb3Modal();
        web3Modal.clearCachedProvider();
      }

      const wasUserLoggedIn = loginStorage.getLogin();

      if (wasUserLoggedIn && wasUserLoggedIn.length > 0) {
        track("User Logged Out");
      }
      await rudder?.reset();

      loginStorage.deleteLogin();
      logoutStorage.setLogout(Date.now().toString());

      deleteCache();
      deleteRefreshToken();
      deleteAccessToken();

      if (connector && connector.connected) {
        connector.killSession();
      }

      magic?.user?.logout();

      setWeb3(undefined);
      setAuthenticationStatus("UNAUTHENTICATED");
      mutate(null);

      if (Platform.OS !== "web") {
        router.push("/");
      }
    },
    [connector]
  );
  //#endregion

  //#region variables
  const accessToken = useAccessToken();
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
    if (authenticationStatus === "IDLE") {
      async function doRefreshToken() {
        setAuthenticationStatus("REFRESHING");
        try {
          await refreshTokens();
          setAuthenticationStatus("AUTHENTICATED");
        } catch (error: any) {
          setAuthenticationStatus("UNAUTHENTICATED");
          console.log(
            "AuthProvider",
            typeof error === "string" ? error : error.message || "unknown"
          );
          await logout();
        }
      }

      doRefreshToken();
    }
  }, [authenticationStatus, logout, refreshTokens]);
  //#endregion

  return (
    <AuthContext.Provider value={authenticationContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
