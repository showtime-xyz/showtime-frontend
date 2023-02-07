import { useState, useCallback, useEffect } from "react";
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
  deleteDisabledSystemTheme,
  getColorScheme as getPersistedColorScheme,
  getDisabledSystemTheme,
  setColorScheme as persistColorScheme,
  setDisabledSystemTheme,
} from "./store";

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const deviceColorScheme = useDeviceColorScheme();
  const nativewind = useTailwindColorScheme();
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

  useEffect(() => {
    const themeChangeListener = () => {
      const theme = Appearance.getColorScheme();
      changeTheme(theme && !getDisabledSystemTheme() ? theme : colorScheme);
    };
    themeChangeListener();
    const appearanceListener =
      Appearance.addChangeListener(themeChangeListener);
    return () => {
      // @ts-ignore
      appearanceListener.remove();
    };
  }, [changeTheme, colorScheme]);

  const handleColorSchemeChange = (newColorScheme: ColorSchemeName) => {
    if (newColorScheme) {
      changeTheme(newColorScheme);
      setDisabledSystemTheme();
    } else {
      deleteDisabledSystemTheme();
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
