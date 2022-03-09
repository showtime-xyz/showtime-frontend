import { useCallback, useMemo } from "react";

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
  chain_identifier?: any;
  description?: string;
  id: number;
  img_url: string;
  link_to_profile__address: string;
  link_to_profile__username: string;
  nft__contract__address?: string;
  nft__nftdisplay__name?: string;
  nft__token_identifier?: any;
  to_timestamp: string;
  type_id: number;
}

export const useNotifications = () => {
  const { isAuthenticated } = useUser();

  const notificationsFetcher = useCallback(
    (index) => {
      const url = isAuthenticated
        ? process.env.NEXT_PUBLIC_NOTIFICATIONS_URL +
          `/v1/notifications?page=${index + 1}&limit=10`
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

  return { ...queryState, data: newData };
};
