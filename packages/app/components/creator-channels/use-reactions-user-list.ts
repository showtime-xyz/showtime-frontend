import { useCallback, useRef, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { Profile } from "app/types";

const PAGE_SIZE = 10;

type ReactionUserResponse = {
  members: {
    admin: boolean;
    created_at: string;
    id: number;
    profile: Profile;
    updated_at: string;
  };
  reaction_id: number;
  self_reacted: boolean;
};

export const useReactionsUserList = ({
  messageId,
  reactionId,
}: {
  messageId?: string;
  reactionId?: string;
}) => {
  let indexRef = useRef(0);
  const messagesUrl = useCallback(
    (index: number, previousPageData: any) => {
      if (previousPageData && !previousPageData?.members.length) return null;
      indexRef.current = index;
      if (reactionId && messageId) {
        return `v1/channels/message/${messageId}/reactions/${reactionId}?page=${
          index + 1
        }&limit=${PAGE_SIZE}`;
      } else {
        return null;
      }
    },
    [reactionId, messageId]
  );

  const queryState = useInfiniteListQuerySWR<ReactionUserResponse>(
    messagesUrl,
    {
      pageSize: PAGE_SIZE,
    }
  );

  const users = useMemo(
    () =>
      queryState.data?.flatMap((d) => d.members).map((f) => f.profile) ?? [],
    [queryState.data]
  );

  return {
    ...queryState,
    users,
  };
};
