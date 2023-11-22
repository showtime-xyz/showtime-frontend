import { useCallback, useMemo, useRef } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";
import { axios } from "app/lib/axios";

import { ChannelMessageItem, ChannelMessageResponse } from "../types";

const PAGE_SIZE = 20;

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

export const getChannelMessageKey = (channelId: string | number) => {
  return `/v1/channels/${channelId}/messages`;
};

export const useChannelMessages = (channelId?: string | number) => {
  let indexRef = useRef(0);
  const messagesUrl = useCallback(
    (index: number, previousPageData: []) => {
      if (previousPageData && !previousPageData.length) return null;
      indexRef.current = index;
      if (channelId) {
        return `${getChannelMessageKey(channelId)}?page=${
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
    },
    (url: string) => {
      return axios({
        url,
        method: "GET",
      }).then((data: ChannelMessageItem[]) => {
        let consecutiveCount = 0; // Initialize the consecutive message count

        // we transform data for useChannelMessages to show the sender's name / or not
        return data.map((item, index, array) => {
          let isSameSenderAsNext = false;

          if (index < array.length - 1) {
            const currentSenderId =
              item?.channel_message?.sent_by?.profile?.profile_id;
            const nextSenderId =
              array[index + 1]?.channel_message?.sent_by?.profile?.profile_id;

            const currentDate = new Date(
              item.channel_message?.created_at
            ).getTime();
            const nextDate = new Date(
              array[index + 1].channel_message?.created_at
            ).getTime();
            const dayDifference =
              Math.abs(currentDate - nextDate) / (1000 * 60 * 60 * 24);

            // Increment count or reset if sender changes
            if (currentSenderId === nextSenderId) {
              consecutiveCount++;
            } else {
              consecutiveCount = 0; // Reset count if sender changes
            }

            // Check for same sender as next, less than a day's difference, and not the 5th message in a row
            isSameSenderAsNext =
              currentSenderId === nextSenderId &&
              dayDifference < 1 &&
              consecutiveCount % 10 !== 0;
          } else {
            // For the last item in the list, always show the sender
            isSameSenderAsNext = false;
          }

          return { ...item, isSameSenderAsNext };
        });
      });
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
