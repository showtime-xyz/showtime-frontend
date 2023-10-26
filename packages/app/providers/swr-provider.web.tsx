import type { AxiosError } from "axios";
import type { Revalidator, RevalidatorOptions } from "swr";
import { SWRConfig } from "swr";
import type { SWRConfiguration } from "swr";

import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { isServer } from "app/lib/is-server";
import { isUndefined } from "app/lib/swr/helper";
import { formatAPIErrorMessage } from "app/utilities";

import { toast } from "design-system/toast";

import { setupSWRCache } from "./swr-cache";

const localStorageProvider = () => {
  const { swrCacheMap, persistCache } = setupSWRCache({
    set: localStorage.setItem.bind(localStorage),
    get: localStorage.getItem.bind(localStorage),
  });

  window.addEventListener("beforeunload", persistCache);

  return swrCacheMap;
};

export const SWRProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { refreshTokens } = useAccessTokenManager();
  return (
    <SWRConfig
      value={{
        provider: isServer ? () => new Map() : localStorageProvider,
        onError: (err) => {
          if (__DEV__ && err?.message && err?.message !== "canceled") {
            console.error(err);
            toast.error(formatAPIErrorMessage(err));
          }
        },
        onErrorRetry: async (
          error: AxiosError,
          key: string,
          config: Readonly<SWRConfiguration>,
          revalidate: Revalidator,
          opts: Required<RevalidatorOptions>
        ) => {
          // bail out immediately if the error is unrecoverable
          if (
            error.response?.status === 400 ||
            error.response?.status === 403 ||
            error.response?.status === 404
          ) {
            return;
          }

          const maxRetryCount = config.errorRetryCount;
          const currentRetryCount = opts.retryCount;

          if (error.response?.status === 401) {
            // we only want to refresh tokens once and then bail out if it fails on 401
            // this is to prevent infinite loops. Actually, we should logout the user but AuthProvider is not available here
            if (currentRetryCount > 1) {
              return;
            }
            try {
              await refreshTokens();
            } catch (err) {
              return;
            }
          }

          // Exponential backoff
          const timeout =
            ~~(
              (Math.random() + 0.5) *
              (1 << (currentRetryCount < 8 ? currentRetryCount : 8))
            ) * (config.errorRetryInterval ?? 1);

          if (
            !isUndefined(maxRetryCount) &&
            currentRetryCount > maxRetryCount
          ) {
            return;
          }

          setTimeout(revalidate, timeout, opts);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
