import { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import useUnmountSignal from "use-unmount-signal";

import { axios } from "app/lib/axios";
import { mixpanel } from "app/lib/mixpanel";
import { accessTokenManager } from "app/lib/access-token-manager";
import { useAccessToken } from "app/lib/access-token";
import { Profile } from "../types";

type RefreshStatus = "IDLE" | "REFRESHING_ACCESS_TOKEN" | "DONE" | "ERROR";
type AuthenticatedStatus = "IDLE" | "AUTHENTICATED" | "UNAUTHENTICATED";

type Follow = {
  profile_id: number;
};

type MyInfoData = {
  data: {
    follows: Follow[];
    profile: Profile;
    likes_nft: number[];
    likes_comment: number[];
    comments: number[];
  };
};

const useUser = () => {
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>("IDLE");
  const [authenticationStatus, setAuthenticationStatus] =
    useState<AuthenticatedStatus>("IDLE");
  const accessToken = useAccessToken();

  const unmountSignal = useUnmountSignal();
  const url = "/v2/myinfo";
  const {
    data: user,
    error,
    mutate,
  } = useSWR<MyInfoData>(accessToken ? [url] : null, (url) =>
    axios({ url, method: "GET", unmountSignal })
  );

  const refreshAccessToken = useCallback(async () => {
    try {
      setRefreshStatus("REFRESHING_ACCESS_TOKEN");
      const newAccessToken = await accessTokenManager.refreshAccessToken();
      if (newAccessToken) {
        setAuthenticationStatus("AUTHENTICATED");
      } else {
        setAuthenticationStatus("UNAUTHENTICATED");
      }
      setRefreshStatus("DONE");
    } catch (error) {
      console.error(error);
      setRefreshStatus("ERROR");
    }

    mutate();
  }, [mutate, setRefreshStatus, setAuthenticationStatus]);

  useEffect(() => {
    refreshAccessToken();
  }, [accessToken]);

  useEffect(() => {
    if (user) {
      //@ts-ignore - there's no publicAddress in API response of myInfo. Verify this is correct
      mixpanel.identify(user.publicAddress);
      // if (user.email) {
      // 	mixpanel.people.set({
      // 		$email: user.email, // only reserved properties need the $
      // 		USER_ID: user.publicAddress, // use human-readable names
      // 	})
      // } else {
      // 	mixpanel.people.set({
      // 		USER_ID: user.publicAddress, // use human-readable names
      // 	})
      // }
    }
  }, [user]);

  const isRefreshingAccessToken = refreshStatus === "REFRESHING_ACCESS_TOKEN";
  const isAuthenticated = authenticationStatus === "AUTHENTICATED";
  const isFetchingAuthenticatedUser =
    !isRefreshingAccessToken && isAuthenticated && !user;

  return {
    user,
    error,
    mutate,
    isLoading:
      isRefreshingAccessToken ??
      isFetchingAuthenticatedUser ??
      (!user && !error),
    isAuthenticated: (user && !error) ?? isAuthenticated,
  };
};

export { useUser };
