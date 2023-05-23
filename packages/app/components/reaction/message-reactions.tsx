import { useCallback } from "react";
import { Platform } from "react-native";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { reactionEmojis } from "./constants";

export const MessageReactions = ({ channelId }: { channelId?: string }) => {
  const router = useRouter();

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
      {reactionEmojis.map((emoji) => {
        return (
          <Pressable key={emoji} onPress={handleReactionPress}>
            <Text tw="text-xs text-gray-700 dark:text-gray-200">
              {emoji} 1.2k
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
