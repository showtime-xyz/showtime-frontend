import { useContext } from "react";
import { Pressable, useWindowDimensions } from "react-native";

import Animated, {
  useAnimatedRef,
  measure,
  runOnJS,
  runOnUI,
} from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Reaction as SVGReaction } from "@showtime-xyz/universal.icon";
import { Pressable as ShowtimePressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ReactionGroup } from "../creator-channels/hooks/use-channel-messages";
import { ChannelReactionResponse } from "../creator-channels/hooks/use-channel-reactions";
import {
  emojiButtonSize,
  reactionButtonSize,
  reactionEmojis,
} from "./constants";
import { ReactionContext } from "./reaction-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  onPress?: (emojiId: any) => void;
  reactionGroup: ReactionGroup[];
  reactions: ChannelReactionResponse;
};

export const Reaction = (props: Props) => {
  const { reactionGroup, onPress, reactions } = props;
  const state = useContext(ReactionContext);
  const positionRef = useAnimatedRef<any>();
  const windowDimension = useWindowDimensions();

  const isDark = useIsDarkMode();
  const setPositions = (pageX: number, pageY: number) => {
    const totalRectButtonWidth = emojiButtonSize * reactionEmojis.length;
    pageX -= totalRectButtonWidth;
    pageX += emojiButtonSize / 2;

    // if picker is going out of window
    if (windowDimension.width - pageX < totalRectButtonWidth) {
      pageX = windowDimension.width - totalRectButtonWidth;
    }

    state.setPosition({ top: pageY, left: pageX });
    state.setReactions(
      <View tw="flex-row overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
        {reactions.map((reaction, index) => (
          <ShowtimePressable
            key={index}
            tw={`items-center justify-center ${
              reactionGroup.findIndex(
                (r) => r.reaction_id === reaction.id && r.self_reacted
              ) !== -1
                ? "rounded-lg bg-blue-50 p-1 dark:bg-gray-900"
                : ""
            }`}
            onPress={() => {
              state.setVisible(false);
              onPress?.(reaction.id);
            }}
            style={{
              width: emojiButtonSize,
              height: emojiButtonSize,
            }}
          >
            <Text tw="text-2xl text-black dark:text-white">
              {reaction.reaction}
            </Text>
          </ShowtimePressable>
        ))}
      </View>
    );

    state.setVisible(true);
  };

  function handlePress() {
    "worklet";
    const dim = measure(positionRef);
    runOnJS(setPositions)(dim.pageX, dim.pageY);
  }

  return (
    <AnimatedPressable
      ref={positionRef}
      onPress={() => {
        runOnUI(handlePress)();
      }}
      style={{ alignSelf: "flex-start" }}
      hitSlop={20}
    >
      <SVGReaction
        width={reactionButtonSize}
        height={reactionButtonSize}
        color={isDark ? colors.gray[400] : colors.gray[700]}
      />
    </AnimatedPressable>
  );
};
