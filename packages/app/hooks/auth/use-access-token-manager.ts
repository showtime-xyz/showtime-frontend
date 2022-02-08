import { useCallback, useRef } from "react";
// import Iron from "@hapi/iron";
import axios from "axios";
import { captureException } from "@sentry/nextjs";
import * as accessTokenStorage from "app/lib/access-token";
import * as refreshTokenStorage from "app/lib/refresh-token";
import { setLogout } from "app/lib/logout";

export function useAccessTokenManager() {
  const isRefreshing = useRef(false);

  //#region methods
  const refreshTokens = useCallback(async function refreshTokens() {
    if (isRefreshing.current) {
      return;
    }
    isRefreshing.current = true;

    try {
      // get refresh token
      const sealedRefreshToken = refreshTokenStorage.getRefreshToken();
      if (!sealedRefreshToken) {
        throw "Missing sealed refresh token";
      }

      // TODO: unseal refresh token
      // const { refreshToken } = await Iron.unseal(
      //   sealedRefreshToken,
      //   // @ts-ignore
      //   process.env.ENCRYPTION_SECRET_V2,
      //   Iron.defaults
      // );

      // call refresh api
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/jwt/refresh`,
        method: "POST",
        data: {
          refresh: sealedRefreshToken,
        },
      });

      const _accessToken = response?.data?.access;
      const _refreshToken = response?.data?.refresh;

      setAccessToken(_accessToken);
      setRefreshToken(_refreshToken);

      isRefreshing.current = false;
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }

      isRefreshing.current = false;

      accessTokenStorage.deleteAccessToken();
      refreshTokenStorage.deleteRefreshToken();
      setLogout(Date.now().toString());

      captureException(error, {
        tags: {
          failed_silent_refresh: "use-access-token-manager.ts",
        },
      });

      throw "Failed to refresh tokens";
    }
  }, []);
  //#endregion

  //#region setters/getters
  const getAccessToken = useCallback(function getAccessToken() {
    return accessTokenStorage.getAccessToken();
  }, []);

  const setAccessToken = useCallback(async function setAccessToken(
    accessToken: string
  ) {
    if (!accessToken || accessToken.length === 0) return;
    accessTokenStorage.setAccessToken(accessToken);
  },
  []);
  const setRefreshToken = useCallback(async function setRefreshToken(
    refreshToken: string
  ) {
    if (!refreshToken || refreshToken.length === 0) return;
    // const sealedRefreshToken = await Iron.seal(
    //   { refreshToken },
    //   //@ts-ignore
    //   process.env.ENCRYPTION_SECRET_V2,
    //   Iron.defaults
    // );
    refreshTokenStorage.setRefreshToken(refreshToken);
  },
  []);
  const setTokens = useCallback(
    async function setTokens(accessToken: string, refreshToken: string) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    },
    [setAccessToken, setRefreshToken]
  );
  //#endregion

  return {
    setTokens,
    setAccessToken,
    setRefreshToken,
    getAccessToken,
    refreshTokens,
  };
}
