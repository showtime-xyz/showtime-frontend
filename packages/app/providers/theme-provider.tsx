import { useEffect, useState } from "react";
import { Platform, useColorScheme as useDeviceColorScheme } from "react-native";

import * as NavigationBar from "expo-navigation-bar";
import { setStatusBarStyle } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useColorScheme as useTailwindColorScheme } from "nativewind";
import { useAppColorScheme, useDeviceContext } from "twrnc";

import { ColorSchemeProvider } from "@showtime-xyz/universal.color-scheme";
import {
  tw, // useColorScheme as useTailwindColorScheme,
} from "@showtime-xyz/universal.tailwind";

import {
  getColorScheme as getPersistedColorScheme,
  setColorScheme as persistColorScheme,
} from "app/lib/color-scheme-store";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  useDeviceContext(tw, { withDeviceColorScheme: false });
  const deviceColorScheme = useDeviceColorScheme();
  const nativewind = useTailwindColorScheme();

  // TODO: remove this once we get rid of `twrnc`
  const [colorScheme, , setColorScheme] = useAppColorScheme(
    tw,
    getPersistedColorScheme() ?? deviceColorScheme
  );

  useState(() => setColorScheme(colorScheme));
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (isDark) {
      if (Platform.OS === "android") {
        NavigationBar.setBackgroundColorAsync("#000");
        NavigationBar.setButtonStyleAsync("light");
      }

      nativewind.setColorScheme("dark");
      tw.setColorScheme("dark");
      SystemUI.setBackgroundColorAsync("black");
      setStatusBarStyle("light");
    } else {
      if (Platform.OS === "android") {
        NavigationBar.setBackgroundColorAsync("#FFF");
        NavigationBar.setButtonStyleAsync("dark");
      }

      nativewind.setColorScheme("light");
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
        nativewind.setColorScheme("dark");
        tw.setColorScheme("dark");
      } else {
        document.body.classList.remove("dark");
        nativewind.setColorScheme("light");
        tw.setColorScheme("light");
      }
    }
  }, [isDark, nativewind]);

  const handleColorSchemeChange = (newColorScheme: typeof colorScheme) => {
    if (newColorScheme) {
      setColorScheme(newColorScheme);
      persistColorScheme(newColorScheme);
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
