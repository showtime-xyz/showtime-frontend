import { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Extrapolation } from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { View } from "@showtime-xyz/universal.view";

const width = 50;
const height = 28;
const thumbHeight = 24;
const thumbWidth = 24;
const thumbOffset = 2;

export type SwitchProps = {
  accessibilityLabel?: string;
  checked?: boolean;
  onChange?: (nextValue: boolean) => void;
};

export const Switch = (props: SwitchProps) => {
  const { checked, onChange, accessibilityLabel } = props;

  const isDark = useIsDarkMode();

  return (
    <Pressable
      style={styles.pressableStyle}
      onPress={useCallback(() => {
        if (onChange) {
          onChange(!checked);
        }
      }, [onChange, checked])}
      accessibilityRole="switch"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
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
        style={styles.thumbStyle}
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
    height: thumbHeight,
    width: thumbWidth,
    backgroundColor: "white",
    borderRadius: 999,
  },
  pressableStyle: {
    justifyContent: "center",
    width,
  },
  gradientWrapper: { overflow: "hidden", borderRadius: 999 },
});
