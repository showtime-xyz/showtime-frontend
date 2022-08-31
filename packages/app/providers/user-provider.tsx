import { useEffect, useMemo, ReactNode } from "react";
import { Platform } from "react-native";

import useSWR from "swr";

import { UserContext } from "app/context/user-context";
import { useAuth } from "app/hooks/auth/use-auth";
import { axios } from "app/lib/axios";
import LogRocket from "app/lib/logrocket";
import { registerForPushNotificationsAsync } from "app/lib/register-push-notification";
import { useRudder } from "app/lib/rudderstack";
import { UserType } from "app/types";

interface UserProviderProps {
  children: ReactNode;
}

export const MY_INFO_ENDPOINT = "/v2/myinfo";

export function UserProvider({ children }: UserProviderProps) {
  //#region hooks
  const { rudder } = useRudder();
  const { authenticationStatus, accessToken } = useAuth();
  const { data, error, mutate } = useSWR<UserType>(
    accessToken ? MY_INFO_ENDPOINT : null,
    (url) => axios({ url, method: "GET" })
  );
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
        LogRocket.identify(data.data.profile.profile_id.toString());
        rudder?.identify(data.data.profile.profile_id.toString(), {});

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
  }, [data, rudder]);
  //#endregion

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}
