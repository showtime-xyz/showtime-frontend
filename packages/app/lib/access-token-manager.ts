import Iron from "@hapi/iron";
import { captureException } from "@sentry/nextjs";
import axios from "axios";
import jwtDecode from "jwt-decode";

import {
  setAccessToken,
  getAccessToken,
  deleteAccessToken,
} from "app/lib/access-token";
import { setLogout } from "app/lib/logout";
import {
  setRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
} from "app/lib/refresh-token";

class AccessToken {
  #accessToken: string | null = null;
  #isRefreshing: boolean;
  #refreshPromise: Promise<any>;

  getAccessToken() {
    return this.#accessToken ?? getAccessToken();
  }

  setAccessToken(newAccessToken: string) {
    setAccessToken(newAccessToken);
    this.#accessToken = newAccessToken;
  }

  deleteAccessToken() {
    deleteAccessToken();
    this.#accessToken = null;
  }

  getPublicAddressFromAccessToken() {
    const accessToken = this.getAccessToken();
    return accessToken ? jwtDecode(accessToken)?.address : null;
  }

  async refresh() {
    const shouldRefresh = !this.#accessToken && !this.#isRefreshing;
    try {
      if (shouldRefresh) {
        const sealedRefreshToken = getRefreshToken();

        if (!sealedRefreshToken) {
          throw "Missing sealed refresh token";
        }

        // TODO:
        // const { refreshToken } = await Iron.unseal(
        // 	sealedRefreshToken,
        // 	process.env.ENCRYPTION_SECRET_V2,
        // 	Iron.defaults
        // )

        this.#isRefreshing = true;
        this.#refreshPromise = axios({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/jwt/refresh`,
          method: "POST",
          data: {
            // refresh: refreshToken,
            refresh: sealedRefreshToken,
          },
        });

        const response = await this.#refreshPromise;
        const newAccessToken = response?.data?.access;
        const newRefreshToken = response?.data?.refresh;

        if (newRefreshToken) {
          const sealedRefreshToken = await Iron.seal(
            { refreshToken: newRefreshToken },
            process.env.ENCRYPTION_SECRET_V2,
            Iron.defaults
          );
          // TODO: set as a cookie instead?
          setRefreshToken(sealedRefreshToken);
        }

        this.#isRefreshing = false;

        return newAccessToken;
      } else {
        const response = await this.#refreshPromise;
        const accessToken = response?.data?.access;
        return accessToken;
      }
    } catch (error) {
      // if (process.env.NODE_ENV === 'development') {
      // 	console.error(error)
      // }

      this.deleteAccessToken();
      deleteRefreshToken();
      setLogout(Date.now().toString());

      captureException(error, {
        tags: {
          failed_silent_refresh: "access-token-manager.ts",
        },
      });
    }
  }

  async refreshAccessToken() {
    const refreshedAccessToken = await this.refresh();
    if (refreshedAccessToken) {
      this.setAccessToken(refreshedAccessToken);
      return refreshedAccessToken;
    }
    return null;
  }
}

const accessTokenManager = new AccessToken();

export { accessTokenManager };
