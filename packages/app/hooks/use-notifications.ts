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
  link_to_profile_address: string;
  link_to_profile_username: string;
  chain_identifier?: any;
  nft_token_identifier?: any;
  contract_address?: string;
  nft_display_name?: string;
  to_timestamp: string;
  type_name: string;
}

export const useNotifications = () => {
  const { isAuthenticated } = useUser();
  const { data: myInfoData } = useMyInfo();

  const notificationsFetcher = useCallback(
    (index: number) => {
      const url = isAuthenticated
        ? `/v1/notifications?page=${index + 1}&limit=15`
        : null;
      return url;
    },
    [isAuthenticated]
  );

  const queryState =
    useInfiniteListQuerySWR<NotificationType>(notificationsFetcher);

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
