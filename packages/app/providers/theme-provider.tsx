import { useEffect, useState } from "react";
import { Platform, useColorScheme as useDeviceColorScheme } from "react-native";

import * as NavigationBar from "expo-navigation-bar";
import { setStatusBarStyle } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useAppColorScheme, useDeviceContext } from "twrnc";

import {
  getColorScheme as getPersistedColorColorSchema,
  setColorScheme as persistColorSchema,
} from "app/lib/color-scheme";

import { ColorSchemeProvider } from "design-system/color-scheme-provider";
import { tw } from "design-system/tailwind";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  useDeviceContext(tw, { withDeviceColorScheme: false });
  const deviceColorScheme = useDeviceColorScheme();
  const [colorScheme, , setColorScheme] = useAppColorScheme(
    tw,
    getPersistedColorColorSchema() ?? deviceColorScheme
  );

  useState(() => setColorScheme(colorScheme));
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (isDark) {
      if (Platform.OS === "android") {
        NavigationBar.setBackgroundColorAsync("#000");
        NavigationBar.setButtonStyleAsync("light");
      }

      tw.setColorScheme("dark");
      SystemUI.setBackgroundColorAsync("black");
      setStatusBarStyle("light");
    } else {
      if (Platform.OS === "android") {
        NavigationBar.setBackgroundColorAsync("#FFF");
        NavigationBar.setButtonStyleAsync("dark");
      }

      tw.setColorScheme("light");
      SystemUI.setBackgroundColorAsync("white");
      setStatusBarStyle("dark");
    }

    if (Platform.OS === "web") {
      document.documentElement.setAttribute(
        "data-color-scheme",
        isDark ? "dark" : "light"
      );
      if (isDark) {
        tw.setColorScheme("dark");
      } else {
        tw.setColorScheme("light");
      }
    }
  }, [isDark]);

  const handleColorSchemeChange = (newColorScheme: typeof colorScheme) => {
    if (newColorScheme) {
      setColorScheme(newColorScheme);
      persistColorSchema(newColorScheme);
    }
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      setColorScheme={handleColorSchemeChange}
    >
      {children}
    </ColorSchemeProvider>
  );
}
