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
    <View tw="w-[40%] min-w-[250px] flex-row justify-between">
      {channelReactions.data?.map((item) => {
        const userReaction = reactionGroup.find(
          (r) => r.reaction_id === item.id
        );
        if (userReaction) {
          return (
            <Pressable
              key={item.id}
              onPress={() => handleReactionPress(item.id)}
              tw={
                userReaction.self_reacted
                  ? "rounded-lg bg-blue-50 p-1 dark:bg-gray-900"
                  : undefined
              }
            >
              <Text
                tw="text-gray-700 dark:text-gray-200"
                style={{ fontSize: 13 }}
              >
                {item.reaction} {userReaction.count}
              </Text>
            </Pressable>
          );
        }
      })}
    </View>
  );
};
