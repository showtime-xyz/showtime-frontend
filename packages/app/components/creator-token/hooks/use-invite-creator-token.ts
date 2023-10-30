import useSWR from "swr";

import { fetcher } from "app/hooks/use-infinite-list-query";

export type AvailableCreatorTokensInviteCodes = {
  code: string;
}[];

export type RedeemedCreatorTokensInviteCodes = {
  invitee: {
    username: string;
    id: number;
  };
  redeemed_at: string;
}[];

export const useAvailableCreatorTokensInvites = () => {
  const queryState = useSWR<AvailableCreatorTokensInviteCodes>(
    "/v1/creator-token/invitations/available?limit=3&page=1",
    fetcher,
    {
      focusThrottleInterval: 5000,
      dedupingInterval: 5000,
      revalidateIfStale: false,
    }
  );

  return queryState;
};

export const useRedeemedCreatorTokensInvites = () => {
  const queryState = useSWR<AvailableCreatorTokensInviteCodes>(
    "/v1/creator-token/invitations/redeemed?limit=10&page=1",
    fetcher,
    {
      focusThrottleInterval: 5000,
      dedupingInterval: 5000,
      revalidateIfStale: false,
    }
  );

  return queryState;
};
