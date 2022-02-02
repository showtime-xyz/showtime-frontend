import { Platform } from "react-native";
import axios from "axios";
import type { Method } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { captureException } from "@sentry/nextjs";

import { accessTokenManager } from "app/lib/access-token-manager";
import { setLogout } from "app/lib/logout";
import { deleteRefreshToken } from "app/lib/refresh-token";

/**
 * An expired or missing access token sent to our backend services will trigger a
 * 401 response status code that we intercept to trigger a silent access token refresh.
 * On refresh success the request will be resent and on failure we force the logout flow.
 */
if (Platform.OS === "web") {
  createAuthRefreshInterceptor(
    axios,
    async () => {
      try {
        const refreshedAccessToken =
          await accessTokenManager.refreshAccessToken();
        const invalidRefreshedAccessToken = !refreshedAccessToken;

        if (invalidRefreshedAccessToken) {
          throw "The refresh request has failed, likely due to an expired refresh token";
        }

        return axios;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }

        accessTokenManager.deleteAccessToken();
        deleteRefreshToken();
        setLogout(Date.now().toString());

        captureException(error, {
          tags: {
            failed_silent_refresh: "axios.ts",
          },
        });

        // Prevents the refresh interceptor from retrying authentication
        return Promise.reject();
      }
    },
    { statusCodes: [401] }
  );
}

export type AxiosParams = {
  url: string;
  method: Method;
  data?: any;
  unmountSignal?: AbortSignal;
};

const axiosAPI = async ({ url, method, data, unmountSignal }: AxiosParams) => {
  const accessToken = accessTokenManager.getAccessToken();
  const authorizationHeader = data?.did
    ? data?.did
    : accessToken
    ? `Bearer ${accessToken}`
    : null;

  const request = {
    baseURL:
      url.startsWith("http") || url.startsWith("/api/")
        ? ""
        : process.env.NEXT_PUBLIC_BACKEND_URL,
    url,
    method,
    data,
    signal: unmountSignal,
    ...(authorizationHeader
      ? {
          headers: {
            Authorization: authorizationHeader,
          },
        }
      : {}),
  };

  // console.log("request to the server ", request);
  try {
    return await axios(request).then((res) => res.data);
  } catch (error) {
    console.log("failed request ", request);
    console.error(error);
    // console.error(error)
  }
};

export { axiosAPI as axios };
