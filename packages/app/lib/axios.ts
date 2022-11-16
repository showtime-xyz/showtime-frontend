import axios from "axios";
import type { Method, AxiosRequestHeaders } from "axios";

import { getAccessToken } from "app/lib/access-token";
import { Logger } from "app/lib/logger";

export type AxiosOverrides = {
  forceAccessTokenAuthorization?: boolean;
};

export type AxiosParams = {
  url: string;
  method: Method;
  data?: any;
  unmountSignal?: AbortSignal;
  overrides?: AxiosOverrides;
  headers?: AxiosRequestHeaders;
};

const axiosAPI = async ({
  url,
  method,
  data,
  unmountSignal,
  headers,
  overrides,
}: AxiosParams) => {
  const accessToken = getAccessToken();
  const forceAccessTokenAuthorization =
    overrides?.forceAccessTokenAuthorization;
  let authorizationHeader = data?.did
    ? data?.did
    : accessToken
    ? `Bearer ${accessToken}`
    : null;

  if (forceAccessTokenAuthorization) {
    authorizationHeader = accessToken ? `Bearer ${accessToken}` : null;
  }

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
            ...headers,
          },
        }
      : headers
      ? { headers }
      : {}),
  };

  try {
    return await axios(request).then((res) => res.data);
  } catch (error: any) {
    Logger.log("Failed request:", request);
    Logger.error(error);

    if (error.response?.data?.error?.message) {
      throw { ...error, message: error.response?.data?.error?.message };
    }

    throw error;
  }
};

export { axiosAPI as axios };
