import { useCallback, useMemo, useRef } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { Profile } from "app/types";

const PAGE_SIZE = 10;

// [
//     {
//         "id": 97,
//         "name": "nishanbende_channel",
//         "created_at": "2023-05-22T22:00:54.214Z",
//         "updated_at": "2023-05-22T22:00:54.215Z",
//         "owner": {
//             "username": "nishanbende",
//             "verified": true,
//             "profile_id": 3366447,
//             "name": "Nishan Bende",
//             "wallet_address": "0x38515E6c8561c9A3e1186E2c1fa274Cc7e3aa7c6",
//             "wallet_address_nonens": "0x38515E6c8561c9A3e1186E2c1fa274Cc7e3aa7c6",
//             "img_url": "https://lh3.googleusercontent.com/AEnH2_JXVpF55uZc0WWhws48yF2TXccF5HbCrz7BXfmPgQQFMr_gDBsQHY6Y5zXT7T_OLz6pQpdr9BML3oIGfUqzI989xPrr3AN4"
//         },
//         "member_count": 650
//     }
// ]

export type ChannelMessage = {
  body: string;
  created_at: string;
  updated_at: string;
  id: number;
  sent_by: {
    admin: boolean;
    created_at: string;
    id: number;
    profile: Profile;
  };
};

export type ReactionGroup = {
  count: number;
  reaction_id: number;
  is_reacted_by_me: boolean;
};

export type ChannelMessageItem = {
  channel_message: ChannelMessage;
  reaction_group: ReactionGroup[];
};

type ChannelMessageResponse = Array<ChannelMessageItem>;

export const useChannelMessages = (channelId?: string) => {
  let indexRef = useRef(0);
  const messagesUrl = useCallback(
    (index: number, previousPageData: []) => {
      if (previousPageData && !previousPageData.length) return null;
      indexRef.current = index;
      if (channelId) {
        return `/v1/channels/${channelId}/messages?page=${
          index + 1
        }&limit=${PAGE_SIZE}`;
      } else {
        return null;
      }
    },
    [channelId]
  );

  const queryState = useInfiniteListQuerySWR<ChannelMessageResponse>(
    messagesUrl,
    {
      pageSize: PAGE_SIZE,
    }
  );
  const newData = useMemo(() => {
    let newData: ChannelMessageResponse = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return {
    ...queryState,
    data: newData,
  };
};
