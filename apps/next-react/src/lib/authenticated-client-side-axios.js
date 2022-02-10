import ClientAccessToken from "@/lib/client-access-token";
import { captureException } from "@sentry/nextjs";
import Axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import Router from "next/router";

const axios = Axios.create();

/**
 * An expired or missing access token sent to our backend services will trigger a
 * 401 response status code that we intercept to trigger a silent access token refresh.
 * On refresh success the request will be resent and on failure we force the logout flow.
 */
createAuthRefreshInterceptor(
  axios,
  async () => {
    try {
      const refreshedAccessTokenValue =
        await ClientAccessToken.refreshAccessToken();
      const invalidRefreshedAccessTokenValue = !refreshedAccessTokenValue;

      if (invalidRefreshedAccessTokenValue) {
        throw "The refresh request has failed, likely due to an expired refresh token";
      }

      return axios;
    } catch (error) {
      const logoutInstance = Axios.create();

      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }

      await logoutInstance.post("/api/auth/logout");
      ClientAccessToken.setAccessToken(null);
      window.localStorage.setItem("logout", Date.now());
      Router.reload(window.location.pathname);

      captureException(error, {
        tags: {
          failed_silent_refresh: "authenticated-client-side-axios.js",
        },
      });

      // Prevents the refresh interceptor from retrying authentication
      return Promise.reject();
    }
  },
  { statusCodes: [401] }
);

/**
 * Configures the Authorization bearer access token before each request
 * dynamically to ensure a request is never referencing a stale access token.
 */
axios.interceptors.request.use(async (request) => {
  const accessToken = ClientAccessToken.getAccessToken();
  if (accessToken) {
    request.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return request;
});

export default axios;
export const isCancel = (err) => Axios.isCancel(err);
export const CancelToken = Axios.CancelToken;
