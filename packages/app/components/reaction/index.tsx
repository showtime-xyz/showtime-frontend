import { useContext } from "react";
import { Pressable, useWindowDimensions, Platform } from "react-native";

import Animated, {
  useAnimatedRef,
  measure,
  runOnJS,
  runOnUI,
} from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Reaction as SVGReaction } from "@showtime-xyz/universal.icon";
import { PressableScale as ShowtimePressable } from "@showtime-xyz/universal.pressable-scale";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { ChannelReactionResponse } from "../creator-channels/hooks/use-channel-reactions";
import { ReactionGroup } from "../creator-channels/types";
import {
  emojiButtonWidth,
  reactionButtonSize,
  emojiButtonHeight,
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
    const totalRectButtonWidth = emojiButtonWidth * reactionEmojis.length;
    pageX -= totalRectButtonWidth;
    pageX += emojiButtonWidth / 2;

    // if picker is going out of window
    if (windowDimension.width - pageX < totalRectButtonWidth) {
      pageX = windowDimension.width - totalRectButtonWidth;
    }

    state.setPosition({ top: pageY, left: pageX });
    state.setReactions(
      <View
        tw="dark:shadow-dark shadow-light flex-row rounded-full bg-white p-2 shadow-md shadow-black/10 dark:bg-black dark:shadow-white/20"
        style={{
          gap: 6,
          elevation: 8,
        }}
      >
        {reactions.map((reaction, index) => (
          <ShowtimePressable
            key={index}
            tw={[
              "items-center justify-center rounded-full hover:bg-gray-200 hover:dark:bg-gray-700",
              reactionGroup.findIndex(
                (r) => r.reaction_id === reaction.id && r.self_reacted
              ) !== -1
                ? "bg-gray-100 p-1 dark:bg-gray-900"
                : "",
            ]}
            onPress={() => {
              state.setVisible(false);
              onPress?.(reaction.id);
            }}
            style={{
              width: emojiButtonWidth,
              height: emojiButtonHeight,
            }}
          >
            <Text
              tw="text-black dark:text-white"
              style={{
                fontSize: 24,
                lineHeight: Platform.select({
                  android: 28,
                  default: undefined,
                }),
              }}
            >
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
    const dim = measure(positionRef) || { pageX: 0, pageY: 0 };
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
