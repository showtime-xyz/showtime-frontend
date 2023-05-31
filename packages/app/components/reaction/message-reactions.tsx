import { useCallback } from "react";
import { Platform } from "react-native";

import Animated, {
  Layout,
  ZoomIn,
  ZoomOut,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { formatToUSNumber } from "app/utilities";

import { ReactionGroup } from "../creator-channels/hooks/use-channel-messages";
import { useChannelReactions } from "../creator-channels/hooks/use-channel-reactions";

const AnimatedView = Animated.createAnimatedComponent(View);

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
    <View tw="w-full flex-1 flex-row items-center">
      {channelReactions.data?.map((item, index) => {
        const userReaction = reactionGroup.find(
          (r) => r.reaction_id === item.id
        );
        if (userReaction) {
          return (
            <AnimatedView
              key={index}
              tw="mr-3"
              layout={Layout.springify().damping(500).stiffness(100)}
              entering={FadeIn}
              exiting={FadeOut}
            >
              <Pressable
                onPress={() => handleReactionPress(item.id)}
                tw={
                  userReaction.self_reacted
                    ? "min-h-[30px] min-w-[30px] rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-900"
                    : "min-h-[30px] min-w-[30px] px-2 py-1"
                }
              >
                <Text
                  tw="h-5 items-center leading-5 text-gray-700 dark:text-gray-200"
                  style={{ fontSize: 13 }}
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
