import { useState, useMemo, useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { View } from "@showtime-xyz/universal.view";

import { emojiButtonSize, reactionEmojis } from "./constants";
import { ReactionContext } from "./reaction-context";

export const ReactionProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [reactions, setReactions] = useState<any>(null);
  const memoizedValue = useMemo(
    () => ({ visible, setVisible, setPosition, setReactions }),
    [visible]
  );
  const handleClose = () => setVisible(false);

  const animatedV = useSharedValue(0);
  useEffect(() => {
    animatedV.value = visible ? 1 : 0;
  }, [visible, animatedV]);

  const animatedStyle = useAnimatedStyle(() => {
    const totalRectButtonWidth = emojiButtonSize * reactionEmojis.length;

    const newV = withSpring(animatedV.value);
    return {
      transform: [
        {
          translateX: totalRectButtonWidth / 2,
        },
        {
          translateY: -emojiButtonSize / 2,
        },
        { scale: newV },
        {
          translateX: -totalRectButtonWidth / 2,
        },
        {
          translateY: emojiButtonSize / 2,
        },
      ],
    };
  }, [animatedV]);

  return (
    <ReactionContext.Provider value={memoizedValue}>
      {children}
      {visible && (
        <View tw="absolute h-full w-full">
          <Pressable tw="absolute h-full w-full" onPress={handleClose} />
          <View tw="absolute" style={position}>
            <Animated.View style={animatedStyle}>{reactions}</Animated.View>
          </View>
        </View>
      )}
    </ReactionContext.Provider>
  );
};
