import { useEffect, useMemo, ReactNode, useRef } from "react";
import { Platform } from "react-native";

import useSWR from "swr";

import { UserContext } from "app/context/user-context";
import { useAuth } from "app/hooks/auth/use-auth";
import { useWallet } from "app/hooks/auth/use-wallet";
import { axios } from "app/lib/axios";
import LogRocket from "app/lib/logrocket";
import { mixpanel } from "app/lib/mixpanel";
import { registerForPushNotificationsAsync } from "app/lib/register-push-notification";
import { rudder } from "app/lib/rudderstack";
import { UserType } from "app/types";

interface UserProviderProps {
  children: ReactNode;
}

export const MY_INFO_ENDPOINT = "/v2/myinfo";

export function UserProvider({ children }: UserProviderProps) {
  //#region hooks
  const { authenticationStatus, accessToken } = useAuth();
  const { data, error, mutate } = useSWR<UserType>(
    accessToken ? MY_INFO_ENDPOINT : null,
    (url) => axios({ url, method: "GET" })
  );
  const { disconnect } = useWallet();
  //#endregion

  //#region variables
  const isLoading =
    authenticationStatus === "IDLE" ||
    authenticationStatus === "REFRESHING" ||
    (authenticationStatus === "AUTHENTICATED" && !error && !data);
  const userContextValue = useMemo(
    () => ({
      user: data,
      mutate,
      error,
      isLoading,
      isAuthenticated: accessToken != undefined,
    }),
    [isLoading, data, accessToken, mutate, error]
  );
  //#endregion

  //#region effects
  useEffect(() => {
    if (
      authenticationStatus === "AUTHENTICATED" ||
      authenticationStatus === "UNAUTHENTICATED"
    ) {
      mutate();
    }
  }, [authenticationStatus, mutate]);

  useEffect(() => {
    const identifyAndRegisterPushNotification = async () => {
      if (data) {
        // Identify user
        mixpanel.identify(data.data.profile.profile_id.toString());
        LogRocket.identify(data.data.profile.profile_id.toString());
        rudder.identify(data.data.profile.profile_id.toString(), {});

        LogRocket.getSessionURL((sessionURL: string) => {
          rudder.track("LogRocket", { sessionURL: sessionURL });
          // Sentry.configureScope(scope => {
          //   scope.setExtra("sessionURL", sessionURL);
          // });
        });

        // Handle registration for push notification
        if (Platform.OS !== "web") {
          await registerForPushNotificationsAsync();
        }
      }
    };

    identifyAndRegisterPushNotification();
  }, [data]);
  //#endregion

  const isMounted = useRef(false);

  // TODO: temp workaround - https://github.com/rainbow-me/rainbow/issues/3870
  useEffect(() => {
    if (!isMounted.current) {
      disconnect?.();
      isMounted.current = true;
    }
  }, [disconnect]);

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}
