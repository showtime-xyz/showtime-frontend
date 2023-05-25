import { useCallback } from "react";
import { Platform } from "react-native";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ReactionGroup } from "../creator-channels/hooks/use-channel-messages";
import { useChannelReactions } from "../creator-channels/hooks/use-channel-reactions";

export const MessageReactions = ({
  channelId,
  messageId,
  reactionGroup,
}: {
  channelId: string;
  reactionGroup: ReactionGroup[];
  messageId: number;
}) => {
  const router = useRouter();
  const channelReactions = useChannelReactions(channelId);

  const handleReactionPress = useCallback(
    (reactionId: number) => {
      const as = `/channels/${channelId}/messages/${messageId}/reactions?selectedReactionId=${reactionId}`;

      router.push(
        Platform.select({
          native: as,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              channelsReactionModal: true,
              messageId,
              channelId,
              selectedReactionId: reactionId,
            },
          } as any,
        }),
        Platform.select({
          native: as,
          web: router.asPath,
        }),
        { shallow: true }
      );
    },
    [router, messageId, channelId]
  );

  return (
    <View tw="max-w-[300px] flex-[5] flex-row justify-between">
      {reactionGroup.map((item) => {
        return (
          <Pressable
            key={item.reaction_id}
            onPress={() => handleReactionPress(item.reaction_id)}
          >
            <Text tw="text-xs text-gray-700 dark:text-gray-200">
              {
                channelReactions.data?.find((r) => {
                  return item.reaction_id === r.id;
                })?.reaction
              }{" "}
              {item.count}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
