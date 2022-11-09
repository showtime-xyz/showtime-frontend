import { useEffect, useState } from "react";
import {
  Platform,
  useColorScheme as useDeviceColorScheme,
  Appearance,
} from "react-native";
import type { ColorSchemeName } from "react-native";

import * as NavigationBar from "expo-navigation-bar";
import { setStatusBarStyle } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useColorScheme as useTailwindColorScheme } from "nativewind";

import { ColorSchemeContext } from "./context";
import {
  getColorScheme as getPersistedColorScheme,
  setColorScheme as persistColorScheme,
} from "./store";

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const deviceColorScheme = useDeviceColorScheme();
  const nativewind = useTailwindColorScheme();
  const [isFollowDeviceSetting, setIsFollowingDeviceSetting] = useState(true);
  const [colorScheme, setColorScheme] = useState<"dark" | "light">(
    getPersistedColorScheme() ?? deviceColorScheme
  );
  const isDark = colorScheme === "dark";

  useEffect(() => {
    Appearance.addChangeListener((preferences) => {
      if (isFollowDeviceSetting) {
        handleColorSchemeChange(preferences.colorScheme);
      }
    });
    if (isDark) {
      if (Platform.OS === "android") {
        NavigationBar.setBackgroundColorAsync("#000");
        NavigationBar.setButtonStyleAsync("light");
      }

      nativewind.setColorScheme("dark");
      SystemUI.setBackgroundColorAsync("black");
      setStatusBarStyle("light");
    } else {
      if (Platform.OS === "android") {
        NavigationBar.setBackgroundColorAsync("#FFF");
        NavigationBar.setButtonStyleAsync("dark");
      }

      nativewind.setColorScheme("light");
      SystemUI.setBackgroundColorAsync("white");
      setStatusBarStyle("dark");
    }
  }, [isDark, nativewind, isFollowDeviceSetting]);

  const handleColorSchemeChange = (newColorScheme: ColorSchemeName) => {
    if (newColorScheme) {
      setColorScheme(newColorScheme);
      persistColorScheme(newColorScheme);
      setIsFollowingDeviceSetting(false);
    } else {
      setIsFollowingDeviceSetting(true);
    }
  };

  return (
    <ColorSchemeContext.Provider
      value={{ colorScheme, setColorScheme: handleColorSchemeChange }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
}
