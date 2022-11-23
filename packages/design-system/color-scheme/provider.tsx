import { useState, useCallback, useRef, useEffect } from "react";
import {
  useColorScheme as useDeviceColorScheme,
  Appearance,
  Platform,
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
  const isFollowDeviceSetting = useRef(true);
  const [colorScheme, setColorScheme] = useState<"dark" | "light">(
    getPersistedColorScheme() ?? deviceColorScheme
  );
  const changeTheme = useCallback(
    (newColorScheme: ColorSchemeName) => {
      if (!newColorScheme) return;
      persistColorScheme(newColorScheme);
      setColorScheme(newColorScheme);
      const isDark = newColorScheme === "dark";
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
    },
    [nativewind]
  );
  const themeChangeListener = useCallback(() => {
    const theme = Appearance.getColorScheme();
    if (theme && isFollowDeviceSetting.current) {
      changeTheme(theme);
    }
  }, [changeTheme]);

  useEffect(() => {
    themeChangeListener();
    const appearanceListener =
      Appearance.addChangeListener(themeChangeListener);
    return () => {
      // @ts-ignore
      appearanceListener.remove();
    };
  }, [themeChangeListener, changeTheme]);

  const handleColorSchemeChange = (newColorScheme: ColorSchemeName) => {
    if (newColorScheme) {
      changeTheme(newColorScheme);
      isFollowDeviceSetting.current = false;
    } else {
      isFollowDeviceSetting.current = true;
      const theme = Appearance.getColorScheme();
      if (theme) {
        changeTheme(theme);
      }
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
