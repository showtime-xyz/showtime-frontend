import { useEffect, useState } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

import { useAppColorScheme, useDeviceContext } from "twrnc";

import { tw } from "@showtime-xyz/universal.tailwind";

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
  useDeviceContext(tw, { withDeviceColorScheme: false });
  const deviceColorScheme = useDeviceColorScheme();

  // TODO: remove this once we get rid of `twrnc`
  const [colorScheme, , setColorScheme] = useAppColorScheme(
    tw,
    getPersistedColorScheme() ?? deviceColorScheme
  );

  useState(() => setColorScheme(colorScheme));
  const isDark = colorScheme === "dark";

  useEffect(() => {
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
  }, [isDark]);

  const handleColorSchemeChange = (newColorScheme: typeof colorScheme) => {
    if (newColorScheme) {
      setColorScheme(newColorScheme);
      persistColorScheme(newColorScheme);
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
