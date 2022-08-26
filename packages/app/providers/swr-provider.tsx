import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

import NetInfo from "@react-native-community/netinfo";
import { MMKV } from "react-native-mmkv";
import type { Revalidator, RevalidatorOptions } from "swr";
import { SWRConfig } from "swr";
import type { PublicConfiguration } from "swr/dist/types";

import { useToast } from "@showtime-xyz/universal.toast";

import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { isUndefined } from "app/lib/swr/helper";

function mmkvProvider() {
  const storage = new MMKV();
  const appCache = storage.getString("app-cache");
  const map = new Map(appCache ? JSON.parse(appCache) : []);

  AppState.addEventListener("change", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    storage.set("app-cache", appCache);
  });

  return map;
}

export const SWRProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const toast = useToast();
  const { refreshTokens } = useAccessTokenManager();
  const isOnline = useRef<boolean>(true);

  useEffect(() => {
    NetInfo.fetch().then((s) => {
      isOnline.current = !!s.isConnected && !!s.isInternetReachable;
    });

    const unsubscribe = NetInfo.addEventListener((s) => {
      isOnline.current = !!s.isConnected && !!s.isInternetReachable;
    });

    return unsubscribe;
  }, []);

  return (
    <SWRConfig
      value={{
        provider: mmkvProvider,
        onError: (err) => {
          if (err?.message && __DEV__) {
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
        isVisible: () => {
          return AppState.currentState === "active";
        },
        isOnline: () => {
          return isOnline.current;
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
