import { useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

import NetInfo from "@react-native-community/netinfo";
import type { AxiosError } from "axios";
import { MMKV } from "react-native-mmkv";
import type { Revalidator, RevalidatorOptions } from "swr";
import { SWRConfig } from "swr";
import type { PublicConfiguration } from "swr/_internal";

import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { useIsOnline } from "app/hooks/use-is-online";
import { deleteAccessToken } from "app/lib/access-token";
import * as loginStorage from "app/lib/login";
import * as logoutStorage from "app/lib/logout";
import { deleteRefreshToken } from "app/lib/refresh-token";
import { isUndefined } from "app/lib/swr/helper";
import { formatAPIErrorMessage } from "app/utilities";

import { toast } from "design-system/toast";

import { setupSWRCache } from "./swr-cache";

function mmkvProvider() {
  const storage = new MMKV();
  const { swrCacheMap, persistCache } = setupSWRCache({
    set: storage.set.bind(storage),
    get: storage.getString.bind(storage),
  });

  AppState.addEventListener("change", function persistCacheOnAppBackground(s) {
    if (s === "background") {
      persistCache();
    }
  });

  return swrCacheMap;
}

export const SWRProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { refreshTokens } = useAccessTokenManager();
  const { isOnline } = useIsOnline();
  const lastError = useRef<AxiosError | null>(null);

  return (
    <SWRConfig
      value={{
        provider: mmkvProvider,
        onError: (err) => {
          if (err?.message && __DEV__ && lastError.current !== err?.message) {
            console.error(err);
            toast.error(formatAPIErrorMessage(err));
            // sometimes we receive massive toast error spams, I added a little check to prevent that
            lastError.current = err.message;
          }
        },
        onErrorRetry: async (
          error: AxiosError,
          key: string,
          config: Readonly<PublicConfiguration>,
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
              if (__DEV__) {
                loginStorage.deleteLogin();
                logoutStorage.setLogout(Date.now().toString());
                deleteRefreshToken();
                deleteAccessToken();
              }
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
            ) * config.errorRetryInterval;

          if (
            !isUndefined(maxRetryCount) &&
            currentRetryCount > maxRetryCount
          ) {
            return;
          }

          setTimeout(revalidate, timeout, opts);
        },
        isVisible: () => {
          return AppState.currentState === "active";
        },
        isOnline: () => {
          return isOnline;
        },
        // TODO: tab focus too
        initFocus(callback) {
          const onAppStateChange = (nextAppState: AppStateStatus) => {
            /* If it's resuming from background or inactive mode to active one */
            if (nextAppState === "active") {
              callback();
            }
          };

          // Subscribe to the app state change events
          const listener = AppState.addEventListener(
            "change",
            onAppStateChange
          );

          return () => {
            if (listener) {
              listener.remove();
            }
          };
        },
        initReconnect(callback) {
          const unsubscribe = NetInfo.addEventListener((s) => {
            if (s.isInternetReachable && s.isConnected) {
              callback();
            }
          });

          return unsubscribe;
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};
