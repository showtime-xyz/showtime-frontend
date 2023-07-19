import { useCallback } from "react";
import { Platform } from "react-native";

import Animated, { Layout, FadeIn, FadeOut } from "react-native-reanimated";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { formatToUSNumber } from "app/utilities";

import { ReactionGroup } from "../creator-channels/hooks/use-channel-messages";
import { ChannelReactionResponse } from "../creator-channels/hooks/use-channel-reactions";

const AnimatedView = Animated.createAnimatedComponent(View);

export const MessageReactions = ({
  channelId,
  messageId,
  reactionGroup,
  channelReactions,
  isStarDrop,
}: {
  channelId: string;
  reactionGroup: ReactionGroup[];
  messageId: number;
  channelReactions: ChannelReactionResponse;
  isStarDrop?: boolean;
}) => {
  const router = useRouter();

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
    <View tw="-ml-0.5 w-full flex-1 flex-row items-center">
      {channelReactions.map((item, index) => {
        const userReaction = reactionGroup.find(
          (r) => r.reaction_id === item.id
        );
        if (userReaction) {
          return (
            <AnimatedView
              key={index}
              tw="mr-1"
              layout={Layout.springify().damping(500).stiffness(100)}
              entering={FadeIn}
              exiting={FadeOut}
            >
              <Pressable
                onPress={() => handleReactionPress(item.id)}
                tw={[
                  "min-h-[25px] items-center justify-center px-2",
                  userReaction.self_reacted
                    ? isStarDrop
                      ? "rounded-lg bg-gray-50 dark:bg-gray-50"
                      : "rounded-lg bg-gray-100 dark:bg-gray-900"
                    : "",
                ]}
              >
                <Text
                  tw={[
                    isStarDrop
                      ? "text-black"
                      : "text-gray-700 dark:text-gray-200",
                  ]}
                  style={{
                    fontSize: 12,
                    lineHeight: Platform.select({
                      web: 12,
                      ios: undefined,
                      android: 14,
                    }),
                  }}
                >
                  {item.reaction} {formatToUSNumber(userReaction.count)}
                </Text>
              </Pressable>
            </AnimatedView>
          );
        }
      })}
    </View>
  );
};
