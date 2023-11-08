import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { AppState } from "react-native";

import { useSWRConfig } from "swr";

import { useRouter } from "@showtime-xyz/universal.router";

import { AuthContext } from "app/context/auth-context";
import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { useFetchOnAppForeground } from "app/hooks/use-fetch-on-app-foreground";
import { useWalletMobileSDK } from "app/hooks/use-wallet-mobile-sdk";
import { useWeb3 } from "app/hooks/use-web3";
import * as accessTokenStorage from "app/lib/access-token";
import { deleteAccessToken, useAccessToken } from "app/lib/access-token";
import { Analytics, EVENTS } from "app/lib/analytics";
import { axios } from "app/lib/axios";
import { deleteAppCache } from "app/lib/delete-cache";
import * as loginStorage from "app/lib/login";
import { loginPromiseCallbacks } from "app/lib/login-promise";
import * as logoutStorage from "app/lib/logout";
import { useMagic } from "app/lib/magic";
import { useWeb3Modal } from "app/lib/react-native-web3-modal";
import { deleteRefreshToken } from "app/lib/refresh-token";
import type { AuthenticationStatus, MyInfo } from "app/types";

import { MY_INFO_ENDPOINT } from "./user-provider";

interface AuthProviderProps {
  children: React.ReactNode;
  onWagmiDisconnect?: () => void;
}

// 6 hours
const REFRESH_TOKEN_MAX_INTERVAL_MILLISECONDS = 8 * 60 * 60 * 1000;

export function AuthProvider({
  children,
  onWagmiDisconnect,
}: AuthProviderProps) {
  const initialRefreshTokenRequestSent = useRef(false);
  const lastRefreshTokenSuccessTimestamp = useRef<number | null>(null);
  const appState = useRef(AppState.currentState);

  //#region state
  const [authenticationStatus, setAuthenticationStatus] =
    useState<AuthenticationStatus>(() =>
      accessTokenStorage.getAccessToken() ? "AUTHENTICATED" : "IDLE"
    );

  //#endregion

  //#region hooks
  const { mutate } = useSWRConfig();
  const web3Modal = useWeb3Modal();
  const mobileSDK = useWalletMobileSDK();
  const { setWeb3 } = useWeb3();
  const { magic } = useMagic();
  const { setTokens, refreshTokens } = useAccessTokenManager();
  const fetchOnAppForeground = useFetchOnAppForeground();
  const router = useRouter();
  //#endregion

  //#region methods
  const login = useCallback(
    async function login(endpoint: string, data: object): Promise<MyInfo> {
      const response = await fetchOnAppForeground({
        url: `/v1/${endpoint}`,
        method: "POST",
        data,
      });

      const accessToken = response?.access;
      const refreshToken = response?.refresh;
      const validResponse = accessToken && refreshToken;
      const res = await axios({
        url: MY_INFO_ENDPOINT,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (validResponse && res) {
        setTokens(accessToken, refreshToken);
        loginStorage.setLogin(Date.now().toString());
        mutate(MY_INFO_ENDPOINT, res);
        setAuthenticationStatus("AUTHENTICATED");
        Analytics.setUserId(res?.data?.profile?.profile_id);
        Analytics.track(EVENTS.USER_LOGIN, undefined, {
          user_id: res?.data?.profile?.profile_id,
        });

        if (router.canGoBack()) {
          router.pop();
        } else {
          router.replace("/");
        }

        return res;
      }

      setAuthenticationStatus("UNAUTHENTICATED");
      throw "Login failed";
    },
    [setTokens, setAuthenticationStatus, fetchOnAppForeground, mutate, router]
  );
  /**
   * Log out the customer if logged in, and clear auth cache.
   */
  const logout = useCallback(
    async function logout() {
      const wasUserLoggedIn = loginStorage.getLogin();
      if (wasUserLoggedIn && wasUserLoggedIn.length > 0) {
        Analytics.track(EVENTS.USER_LOGGED_OUT);
        Analytics.reset();
      }

      onWagmiDisconnect?.();
      loginStorage.deleteLogin();
      logoutStorage.setLogout(Date.now().toString());

      deleteAppCache();
      deleteRefreshToken();
      deleteAccessToken();

      if (web3Modal && web3Modal.isConnected) {
        web3Modal.disconnect();
      }

      if (mobileSDK && mobileSDK.connected) {
        mobileSDK.disconnect();
      }

      magic?.user?.logout();

      setWeb3(null);
      setAuthenticationStatus("UNAUTHENTICATED");
      mutate(null);

      router.push("/");
    },
    [
      onWagmiDisconnect,
      web3Modal,
      mobileSDK,
      magic?.user,
      setWeb3,
      mutate,
      router,
    ]
  );
  const doRefreshToken = useCallback(async () => {
    setAuthenticationStatus("REFRESHING");
    try {
      await refreshTokens();
      setAuthenticationStatus("AUTHENTICATED");
      lastRefreshTokenSuccessTimestamp.current = new Date().getTime();
    } catch (error: any) {
      setAuthenticationStatus("UNAUTHENTICATED");
      console.error(
        "AuthProvider",
        typeof error === "string" ? error : error.message || "unknown"
      );
    }
  }, [refreshTokens, setAuthenticationStatus]);
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
    if (!initialRefreshTokenRequestSent.current) {
      doRefreshToken();
      initialRefreshTokenRequestSent.current = true;
    }
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // Re-request refresh token after 6 hours
        if (
          lastRefreshTokenSuccessTimestamp.current &&
          new Date().getTime() - lastRefreshTokenSuccessTimestamp.current >
            REFRESH_TOKEN_MAX_INTERVAL_MILLISECONDS
        ) {
          doRefreshToken();
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [doRefreshToken]);

  useEffect(() => {
    if (authenticationStatus === "AUTHENTICATED") {
      loginPromiseCallbacks.resolve?.(true);
      loginPromiseCallbacks.resolve = null;
    }
  }, [authenticationStatus]);

  //#endregion

  return (
    <AuthContext.Provider value={authenticationContextValue}>
      {children}
    </AuthContext.Provider>
  );
}
