import { useState, useMemo, useCallback } from "react";
import { useWindowDimensions } from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { View } from "@showtime-xyz/universal.view";

import { emojiButtonWidth, reactionEmojis } from "./constants";
import { ReactionContext } from "./reaction-context";

export const ReactionProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [reactions, setReactions] = useState<any>(null);
  const animatedV = useSharedValue(0);
  const { width } = useWindowDimensions();
  const close = () => {
    setVisible(false);
  };
  const handleClose = () => {
    animatedV.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(close)();
    });
  };
  const toggle = useCallback(
    (v: boolean) => {
      if (v) {
        setVisible(v);
        animatedV.value = withSpring(1, { mass: 0.8, stiffness: 150 });
      } else {
        animatedV.value = withTiming(0, { duration: 150 }, () => {
          runOnJS(close)();
        });
      }
    },
    [animatedV]
  );
  const memoizedValue = useMemo(
    () => ({ visible, setVisible: toggle, setPosition, setReactions }),
    [toggle, visible]
  );

  const animatedStyle = useAnimatedStyle(() => {
    const totalRectButtonWidth = emojiButtonWidth * reactionEmojis.length;

    return {
      willChange: "transform", // make it hardware accelerated on web
      transform: [
        {
          translateX: width < 768 ? -18 : -totalRectButtonWidth / 2 + 60,
        },
        {
          translateY: -emojiButtonWidth / 2 + 10,
        },
        { scale: animatedV.value },
      ],
    };
  }, [animatedV, width]);

  return (
    <ReactionContext.Provider value={memoizedValue}>
      {children}
      {visible && (
        <View tw="absolute h-full w-full bg-black/60">
          <Pressable tw="absolute h-full w-full" onPress={handleClose} />
          <View tw="absolute" style={position}>
            <Animated.View style={animatedStyle}>{reactions}</Animated.View>
          </View>
        </View>
      )}
    </ReactionContext.Provider>
  );
};
