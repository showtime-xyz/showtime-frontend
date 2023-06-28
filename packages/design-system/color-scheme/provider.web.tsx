import { useEffect, useState, useCallback } from "react";
import {
  useColorScheme as useDeviceColorScheme,
  Appearance,
} from "react-native";
import type { ColorSchemeName } from "react-native";

import { ColorSchemeContext } from "./context";
import {
  deleteDisabledSystemTheme,
  getColorScheme as getPersistedColorScheme,
  setColorScheme as persistColorScheme,
  setDisabledSystemTheme,
} from "./store";
import { getDisabledSystemTheme } from "./store";

// eslint-disable-next-line unused-imports/no-unused-vars
export const toggleColorScheme = (isDark?: boolean) => {};

export function ColorSchemeProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const deviceColorScheme = useDeviceColorScheme();
  const [colorScheme, setColorScheme] = useState<"dark" | "light">(
    getPersistedColorScheme() ?? deviceColorScheme
  );
  const changeTheme = useCallback((newColorScheme: ColorSchemeName) => {
    if (!newColorScheme) return;
    persistColorScheme(newColorScheme);
    setColorScheme(newColorScheme);
    const isDark = newColorScheme === "dark";
    document.documentElement.setAttribute(
      "data-color-scheme",
      isDark ? "dark" : "light"
    );
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

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
