import axios from "axios";
import type { Method, AxiosRequestHeaders } from "axios";

import { getAccessToken } from "app/lib/access-token";

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
      : {}),
  };

  try {
    return await axios(request).then((res) => res.data);
  } catch (error) {
    console.log("Failed request:", request);
    console.error(error);
    throw error;
  }
};

export { axiosAPI as axios };
