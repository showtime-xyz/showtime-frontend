import { useContext } from "react";

import useSWR from "swr";

import { UserContext } from "app/context/user-context";
import { fetcher } from "app/hooks/use-infinite-list-query";

export const UNREAD_MESSAGES_KEY = "/v1/channels/unread";
export const useChannelsUnreadMessages = () => {
  const userContext = useContext(UserContext);

  const queryState = useSWR<any>(
    userContext?.isAuthenticated ? UNREAD_MESSAGES_KEY : null,
    fetcher,
    {
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 10000, // 10 seconds
      focusThrottleInterval: 30000, // 30 seconds
    }
  );

  return {
    ...queryState,
  };
};
