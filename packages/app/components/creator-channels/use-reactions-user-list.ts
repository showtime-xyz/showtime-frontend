import { useCallback, useRef, useMemo } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";

import { UserItemType } from "./hooks/use-follower-list";

const PAGE_SIZE = 10;

type ReactionUserResponse = {
  members: UserItemType[];
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
    (index: number, previousPageData: []) => {
      if (previousPageData && !previousPageData.length) return null;
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
    () => queryState.data?.flatMap((d) => d.members) ?? [],
    [queryState.data]
  );

  return {
    ...queryState,
    users,
  };
};
