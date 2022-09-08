import { useCallback, useMemo } from "react";
import { Platform, Pressable } from "react-native";

import { MotiView } from "moti";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";

import {
  useOnFocus,
  useOnHover,
  useIsDarkMode,
} from "@showtime-xyz/universal.hooks";
import { colors } from "@showtime-xyz/universal.tailwind";

type CheckboxProps = {
  onChange: (checked: boolean) => void;
  checked: boolean;
  hitSlop?: number;
  accesibilityLabel: string;
  id?: string;
  disabled?: boolean;
};

export const Checkbox = ({
  checked,
  onChange,
  id,
  hitSlop = 14,
  accesibilityLabel,
  disabled,
}: CheckboxProps) => {
  const handleChange = useCallback(() => {
    onChange(!checked);
  }, [onChange, checked]);
  const isDark = useIsDarkMode();

  const { onHoverIn, onHoverOut, hovered } = useOnHover();
  const { onFocus, onBlur, focused } = useOnFocus();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: hovered.value ? colors.gray[400] : colors.gray[300],
      boxShadow:
        Platform.OS === "web" && focused.value
          ? "0px 0px 0px 4px #E4E4E7"
          : undefined,
      disabled: disabled ? 0.4 : 1,
    };
  }, [focused, hovered, disabled]);

  return (
    <Pressable
      onPress={handleChange}
      //@ts-ignore - web only prop
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      onFocus={onFocus}
      onBlur={onBlur}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accesibilityLabel}
      disabled={disabled}
      hitSlop={hitSlop}
      //@ts-ignore - web only - checkbox toggle on spacebar press
      onKeyDown={Platform.select({
        web: (e: any) => {
          if (e.code === "Space") handleChange();
        },
        default: undefined,
      })}
    >
      <Animated.View
        style={useMemo(
          () => [
            {
              height: 24,
              width: 24,
              borderRadius: 4,
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark ? "#000" : "#FFF",
            },
            animatedStyle,
          ],
          [animatedStyle, isDark]
        )}
      >
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: checked ? 1 : 0 }}
          transition={{ duration: 100, type: "timing" }}
        >
          <Svg width="13" height="12" viewBox="0 0 13 12" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.5735 0.180762C13.0259 0.497477 13.1359 1.12101 12.8192 1.57346L5.81923 11.5735C5.64971 11.8156 5.38172 11.9704 5.08722 11.9962C4.79273 12.022 4.50193 11.9161 4.29289 11.7071L0.292893 7.7071C-0.0976311 7.31658 -0.0976311 6.68341 0.292893 6.29289C0.683417 5.90236 1.31658 5.90236 1.70711 6.29289L4.86429 9.45007L11.1808 0.426532C11.4975 -0.0259174 12.121 -0.135952 12.5735 0.180762Z"
              fill={isDark ? "#FFFFFF" : "#18181B"}
            />
          </Svg>
        </MotiView>
      </Animated.View>
      {Platform.OS === "web" && (
        <input
          disabled={disabled}
          type="checkbox"
          id={id}
          hidden
          onChange={handleChange}
          checked={checked}
        />
      )}
    </Pressable>
  );
};
