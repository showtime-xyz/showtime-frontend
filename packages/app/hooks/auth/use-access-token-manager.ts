import { useCallback, useRef } from "react";

import { captureException } from "@sentry/nextjs";

import * as accessTokenStorage from "app/lib/access-token";
// import Iron from "@hapi/iron";
import { axios } from "app/lib/axios";
import { setLogout } from "app/lib/logout";
import * as refreshTokenStorage from "app/lib/refresh-token";

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
        url: `/v1/jwt/refresh`,
        method: "POST",
        data: {
          refresh: sealedRefreshToken,
        },
      });

      const _accessToken = response?.access;
      const _refreshToken = response?.refresh;

      setAccessToken(_accessToken);
      setRefreshToken(_refreshToken);

      isRefreshing.current = false;
    } catch (error: any) {
      isRefreshing.current = false;

      // accessTokenStorage.deleteAccessToken();
      // refreshTokenStorage.deleteRefreshToken();
      // setLogout(Date.now().toString());

      captureException(error, {
        tags: {
          failed_silent_refresh: "use-access-token-manager.ts",
        },
      });

      throw `Failed to refresh tokens. ${
        typeof error === "string" ? error : error.message || ""
      }`;
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
