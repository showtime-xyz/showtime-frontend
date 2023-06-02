import { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Extrapolation } from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { View } from "@showtime-xyz/universal.view";

const PRESET_SIZE = {
  small: {
    width: 44.5,
    height: 21.5,
    thumbHeight: 17.5,
    thumbWidth: 17.5,
    thumbOffset: 2,
  },
  regular: {
    width: 50,
    height: 28,
    thumbHeight: 24,
    thumbWidth: 24,
    thumbOffset: 2,
  },
};

export type SwitchProps = {
  checked?: boolean;
  onChange?: (nextValue: boolean) => void;
  size?: "small" | "regular";
};

export const Switch = (props: SwitchProps) => {
  const { checked, onChange, size = "regular", ...rest } = props;

  const isDark = useIsDarkMode();
  const width = PRESET_SIZE[size].width;
  const height = PRESET_SIZE[size].height;
  const thumbHeight = PRESET_SIZE[size].thumbHeight;
  const thumbWidth = PRESET_SIZE[size].thumbWidth;
  const thumbOffset = PRESET_SIZE[size].thumbOffset;

  return (
    <Pressable
      style={[{ width }, styles.pressableStyle]}
      onPress={useCallback(() => {
        if (onChange) {
          onChange(!checked);
        }
      }, [onChange, checked])}
      role="switch"
      accessibilityState={{ checked }}
      {...rest}
    >
      <View style={styles.gradientWrapper}>
        <LinearGradient
          colors={
            checked
              ? ["#C4B5FD", "#8B5CF6", "#4C1D95"]
              : isDark
              ? ["#3F3F46", "#3F3F46", "#3F3F46"]
              : ["#D4D4D8", "#D4D4D8", "#D4D4D8"]
          }
          start={[0, 1]}
          end={[1, 0]}
          locations={[0, 0.4, 1]}
          style={{ width, height }}
        />
      </View>
      <MotiView
        style={[{ height: thumbHeight, width: thumbWidth }, styles.thumbStyle]}
        animate={{
          translateX: checked ? width - thumbWidth - thumbOffset : thumbOffset,
        }}
        // @ts-ignore
        transition={{ overshootClamping: Extrapolation.CLAMP }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  thumbStyle: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 999,
  },
  pressableStyle: {
    justifyContent: "center",
  },
  gradientWrapper: { overflow: "hidden", borderRadius: 999 },
});
