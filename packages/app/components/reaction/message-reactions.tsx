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
  reactionGroup,
}: {
  channelId: string;
  reactionGroup: ReactionGroup[];
}) => {
  const router = useRouter();
  const channelReactions = useChannelReactions(channelId);

  const handleReactionPress = useCallback(() => {
    const as = `/channels/${channelId}/reactions`;

    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            channelsReactionModal: true,
          },
        } as any,
      }),
      Platform.select({
        native: as,
        web: router.asPath,
      }),
      { shallow: true }
    );
  }, [channelId, router]);

  return (
    <View tw="max-w-[300px] flex-[5] flex-row justify-between">
      {reactionGroup.map((item) => {
        return (
          <Pressable key={item.reaction_id} onPress={handleReactionPress}>
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
