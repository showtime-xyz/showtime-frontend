import React, { useRef, useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  useColorScheme as useDeviceColorScheme,
} from "react-native";

import { useSharedValue } from "react-native-reanimated";

import { useColorScheme as useUserColorScheme } from "app/lib/color-scheme";

export const useColorScheme = () => {
  const userColorScheme = useUserColorScheme();
  const deviceColorScheme = useDeviceColorScheme();

  return userColorScheme ?? deviceColorScheme;
};

export const useIsDarkMode = () => {
  const userColorScheme = useUserColorScheme();
  const deviceColorScheme = useDeviceColorScheme();
  return userColorScheme
    ? userColorScheme === "dark"
    : deviceColorScheme === "dark";
};

export const useOnFocus = () => {
  const focused = useSharedValue(0);
  // use state on web for now till useAnimatedStyle bug is resolved
  const [state, setFocused] = React.useState(0);

  const focusHandler = React.useMemo(() => {
    return {
      onFocus: () => {
        focused.value = 1;
        if (Platform.OS === "web") {
          setFocused(1);
        }
      },
      onBlur: () => {
        focused.value = 0;
        if (Platform.OS === "web") {
          setFocused(0);
        }
      },
      focused: Platform.select({ default: focused, web: { value: state } }),
    };
  }, [state]);

  return focusHandler;
};

export const useOnHover = () => {
  const hovered = useSharedValue(0);
  // use state on web for now till useAnimatedStyle bug is resolved
  const [state, setHovered] = React.useState(0);

  const hoverHandler = React.useMemo(() => {
    return {
      onHoverIn: () => {
        hovered.value = 1;
        if (Platform.OS === "web") {
          setHovered(1);
        }
      },
      onHoverOut: () => {
        hovered.value = 0;
        if (Platform.OS === "web") {
          setHovered(0);
        }
      },
      hovered: Platform.select({ default: hovered, web: { value: state } }),
    };
  }, [state]);

  return hoverHandler;
};

export const useOnPress = () => {
  const pressed = useSharedValue(0);
  // use state on web for now till useAnimatedStyle bug is resolved
  const [state, setPressed] = React.useState(0);

  const pressHandler = React.useMemo(() => {
    return {
      onPressIn: () => {
        pressed.value = 1;
        if (Platform.OS === "web") {
          setPressed(1);
        }
      },
      onPressOut: () => {
        pressed.value = 0;
        if (Platform.OS === "web") {
          setPressed(0);
        }
      },
      pressed: Platform.select({ default: pressed, web: { value: state } }),
    };
  }, [state]);

  return pressHandler;
};

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}

export const useLayout = () => {
  const [layout, setLayout] = useState<
    LayoutChangeEvent["nativeEvent"]["layout"] | undefined
  >();
  const onLayout = (e) => {
    setLayout(e.nativeEvent.layout);
  };

  return { onLayout, layout };
};

type BlurTint = "light" | "dark" | "default";

function getBackgroundColor(intensity: number, tint: BlurTint): string {
  const opacity = intensity / 100;
  switch (tint) {
    case "dark":
      // From Apple iOS 14 Sketch Kit - https://developer.apple.com/design/resources/
      return `rgba(25,25,25,${opacity * 0.78})`;
    case "light":
      // From Apple iOS 14 Sketch Kit - https://developer.apple.com/design/resources/
      return `rgba(249,249,249,${opacity * 0.78})`;
    case "default":
      // From xcode composition
      return `rgba(255,255,255,${opacity * 0.3})`;
  }
}

export function useBlurredBackgroundColor(intensity: number): string {
  const isDark = useIsDarkMode();

  return getBackgroundColor(intensity, isDark ? "dark" : "light");
}
