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

import { ReactionContext } from "app/components/reaction/reaction-provider";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const reactions = ["❤️", "🔥", "😍", "❇️"];

const emojiButtonSize = 54;
const reactionButtonSize = 20;

type Props = {
  onPress?: (emoji: string) => void;
  selected: string;
};

export const Reaction = (props: Props) => {
  const { selected, onPress } = props;
  const state = useContext(ReactionContext);
  const positionRef = useAnimatedRef<any>();
  const windowDimension = useWindowDimensions();

  const isDark = useIsDarkMode();
  const setPositions = (pageX: number, pageY: number) => {
    const totalRectButtonWidth = emojiButtonSize * reactions.length;
    pageX -= totalRectButtonWidth;
    pageX += emojiButtonSize / 2;

    // if picker is going out of window
    if (windowDimension.width - pageX < totalRectButtonWidth) {
      pageX = windowDimension.width - totalRectButtonWidth;
    }

    state.setPosition({ top: pageY, left: pageX });
    state.setReactions(
      <View tw="flex-row overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
        {reactions.map((reaction) => (
          <ShowtimePressable
            key={reaction}
            tw={`items-center justify-center ${
              selected === reaction ? "bg-gray-300/50 dark:bg-gray-600/50" : ""
            }`}
            onPress={() => {
              state.setVisible(false);
              onPress?.(reaction);
            }}
            style={{
              width: emojiButtonSize,
              height: emojiButtonSize,
            }}
          >
            <Text tw="text-2xl">{reaction}</Text>
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
    >
      <SVGReaction
        width={reactionButtonSize}
        height={reactionButtonSize}
        color={isDark ? colors.gray[400] : colors.gray[700]}
      />
    </AnimatedPressable>
  );
};
