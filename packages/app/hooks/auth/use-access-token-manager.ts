import { useCallback, useRef } from "react";

// import Iron from "@hapi/iron";
// import { captureException } from "@sentry/nextjs";
import * as accessTokenStorage from "app/lib/access-token";
import { axios } from "app/lib/axios";
import * as refreshTokenStorage from "app/lib/refresh-token";

export function useAccessTokenManager() {
  const isRefreshing = useRef(false);
  const accessToken = accessTokenStorage.useAccessToken();
  const refreshToken = refreshTokenStorage.useRefreshToken();

  //#region setters/getters
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

  //#region methods
  const refreshTokens = useCallback(
    async function refreshTokens() {
      if (isRefreshing.current) {
        return;
      }
      isRefreshing.current = true;

      try {
        const sealedRefreshToken = refreshTokenStorage.getRefreshToken();

        // logged out users or users with no refresh token should not be able to refresh
        if (sealedRefreshToken) {
          // Call refresh API
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
        } else {
          throw "No refresh token found. User is not logged in.";
        }

        isRefreshing.current = false;
      } catch (error: any) {
        isRefreshing.current = false;

        throw `Failed to refresh tokens. ${
          typeof error === "string" ? error : error.message || ""
        }`;
      }
    },
    [setAccessToken, setRefreshToken]
  );
  //#endregion

  return {
    setTokens,
    setAccessToken,
    setRefreshToken,
    refreshTokens,
    accessToken,
    refreshToken,
  };
}
