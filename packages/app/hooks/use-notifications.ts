import { useCallback, useMemo } from "react";

import { useMyInfo } from "app/hooks/api-hooks";
import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { useUser } from "app/hooks/use-user";

export interface Actor {
  img_url: string;
  name: string;
  profile_id: number;
  username: string;
  wallet_address: string;
}

export interface NotificationType {
  actors: Actor[];
  description?: string;
  id: number;
  img_url: string;
  link_to_profile__address: string;
  link_to_profile__username: string;
  chain_identifier?: any;
  nft__token_identifier?: any;
  nft__contract__address?: string;
  nft__nftdisplay__name?: string;
  to_timestamp: string;
  type_id: number;
}

export const useNotifications = () => {
  const { isAuthenticated } = useUser();
  const { data: myInfoData } = useMyInfo();

  const notificationsFetcher = useCallback(
    (index) => {
      const url = isAuthenticated
        ? process.env.NEXT_PUBLIC_NOTIFICATIONS_URL +
          `/v1/notifications?page=${index + 1}&limit=15`
        : null;
      return url;
    },
    [isAuthenticated]
  );

  // we don't want to suspend here as this is being used in bottom tab bar icon
  const queryState = useInfiniteListQuerySWR<NotificationType>(
    notificationsFetcher,
    { suspense: false }
  );

  const newData = useMemo(() => {
    let newData: NotificationType[] = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  const hasUnreadNotification = useMemo(() => {
    if (
      newData &&
      newData[0] &&
      myInfoData &&
      myInfoData.data &&
      myInfoData.data.profile &&
      (myInfoData.data.profile.notifications_last_opened === null ||
        new Date(newData[0].to_timestamp) >
          new Date(myInfoData.data.profile.notifications_last_opened))
    ) {
      return true;
    }

    return false;
  }, [newData, myInfoData]);

  return { ...queryState, data: newData, hasUnreadNotification };
};
