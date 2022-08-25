import { useEffect, useState } from "react";
import { Platform, useColorScheme as useDeviceColorScheme } from "react-native";

import * as NavigationBar from "expo-navigation-bar";
import { setStatusBarStyle } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useAppColorScheme, useDeviceContext } from "twrnc";

import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import { tw } from "@showtime-xyz/universal.tailwind";

import {
  getColorScheme as getPersistedColorSchema,
  setColorScheme as persistColorSchema,
} from "app/lib/color-scheme-store";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  useDeviceContext(tw, { withDeviceColorScheme: false });
  const deviceColorScheme = useDeviceColorScheme();
  const [colorScheme, , setColorScheme] = useAppColorScheme(
    tw,
    getPersistedColorSchema() ?? deviceColorScheme
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
        document.body.classList.add("dark");
        tw.setColorScheme("dark");
      } else {
        document.body.classList.remove("dark");
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
