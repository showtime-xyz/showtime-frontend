import { useEffect, useMemo, ReactNode, useRef } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";

import { UserContext } from "app/context/user-context";
import { useMyInfo } from "app/hooks/api-hooks";
import { useAuth } from "app/hooks/auth/use-auth";
import { registerForPushNotificationsAsync } from "app/lib/register-push-notification";
import { isProfileIncomplete } from "app/utilities";

interface UserProviderProps {
  children: ReactNode;
}

export const MY_INFO_ENDPOINT = "/v2/myinfo";

export function UserProvider({ children }: UserProviderProps) {
  //#region hooks
  const { authenticationStatus, accessToken } = useAuth();
  const router = useRouter();

  const { data, error, mutate } = useMyInfo();
  //#endregion
  //#region refs
  const isFirstLoad = useRef(true);
  //#endregion
  //#region variables
  const isLoading =
    authenticationStatus === "IDLE" ||
    authenticationStatus === "REFRESHING" ||
    (authenticationStatus === "AUTHENTICATED" && !error && !data);

  const isIncompletedProfile = isProfileIncomplete(data?.data.profile);

  const userContextValue = useMemo(
    () => ({
      user: data,
      mutate,
      error,
      isLoading,
      isAuthenticated: accessToken != undefined,
      isIncompletedProfile,
    }),
    [data, mutate, error, isLoading, accessToken, isIncompletedProfile]
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

    if (authenticationStatus === "UNAUTHENTICATED") {
      isFirstLoad.current = true;
    }
  }, [authenticationStatus, mutate]);

  useEffect(() => {
    const identifyAndRegisterPushNotification = async () => {
      if (data) {
        await registerForPushNotificationsAsync();
      }
    };

    identifyAndRegisterPushNotification();
  }, [data]);
  //#endregion

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}
