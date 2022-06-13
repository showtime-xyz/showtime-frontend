import { useState, useEffect } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

import { useAppColorScheme, useDeviceContext } from "twrnc";

import { tw } from "@showtime-xyz/universal.tailwind";

import {
  setColorScheme as setUserColorScheme,
  useColorScheme as useUserColorScheme,
} from "app/lib/color-scheme";

export const useColorScheme = () => {
  useDeviceContext(tw, { withDeviceColorScheme: false });
  // Default to device color scheme
  const deviceColorScheme = useDeviceColorScheme();
  // User can override color scheme
  const userColorScheme = useUserColorScheme();
  // Use the user color scheme if it's set
  const [colorScheme, , setColorScheme] = useAppColorScheme(
    tw,
    userColorScheme ?? deviceColorScheme
  );

  // setting it before useEffect or else we'll see a flash of white paint before
  useState(() => setColorScheme(colorScheme));
  const isDark = colorScheme === "dark";

  useEffect(() => {
    // change browser's default color scheme
    document.documentElement.setAttribute(
      "data-color-scheme",
      isDark ? "dark" : "light"
    );
    if (isDark) {
      tw.setColorScheme("dark");
    } else {
      tw.setColorScheme("light");
    }
  }, [isDark]);

  const injectedGlobalContext = {
    colorScheme,
    setColorScheme: (newColorScheme: "light" | "dark") => {
      setColorScheme(newColorScheme);
      setUserColorScheme(newColorScheme);
    },
  };

  return { injectedGlobalContext };
};
