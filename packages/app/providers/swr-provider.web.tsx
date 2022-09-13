import type { Revalidator, RevalidatorOptions } from "swr";
import { SWRConfig } from "swr";
import type { PublicConfiguration } from "swr/dist/types";

import { useToast } from "@showtime-xyz/universal.toast";

import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { isServer } from "app/lib/is-server";
import { isUndefined } from "app/lib/swr/helper";

const localStorageProvider = () => {
  // @ts-ignore
  const map = new Map(JSON.parse(localStorage.getItem("app-cache")) || []);

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });

  return map;
};

export const SWRProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const toast = useToast();
  const { refreshTokens } = useAccessTokenManager();

  return (
    <SWRConfig
      value={{
        provider: isServer ? () => new Map() : localStorageProvider,
        onError: (err) => {
          if (__DEV__ && err?.message && err?.message !== "canceled") {
            console.error(err);
            toast?.show({
              message: err.message,
              hideAfter: 4000,
            });
          }
        },
        onErrorRetry: async (
          error: {
            status: number;
          },
          key: string,
          config: Readonly<PublicConfiguration>,
          revalidate: Revalidator,
          opts: Required<RevalidatorOptions>
        ) => {
          const maxRetryCount = config.errorRetryCount;
          const currentRetryCount = opts.retryCount;

          // Exponential backoff
          const timeout =
            ~~(
              (Math.random() + 0.5) *
              (1 << (currentRetryCount < 8 ? currentRetryCount : 8))
            ) * config.errorRetryInterval;

          if (
            !isUndefined(maxRetryCount) &&
            currentRetryCount > maxRetryCount
          ) {
            return;
          }

          if (error.status === 404) {
            return;
          }

          if (error.status === 401) {
            await refreshTokens();
          }

          setTimeout(revalidate, timeout, opts);
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
