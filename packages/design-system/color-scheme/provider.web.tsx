import { useEffect, useState, useCallback } from "react";
import {
  useColorScheme as useDeviceColorScheme,
  Appearance,
} from "react-native";
import type { ColorSchemeName } from "react-native";

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
  const [colorScheme, setColorScheme] = useState<"dark" | "light">(
    getPersistedColorScheme() ?? deviceColorScheme
  );
  const isDark = colorScheme === "dark";

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
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const themeChangeListener = useCallback(() => {
    const theme = Appearance.getColorScheme();
    const disabledSystemTheme = localStorage.getItem("disabledSystemTheme");

    if (theme && !disabledSystemTheme) {
      changeTheme(theme);
    } else {
      changeTheme(colorScheme);
    }
  }, [changeTheme, colorScheme]);

  useEffect(() => {
    themeChangeListener();
    const appearanceListener =
      Appearance.addChangeListener(themeChangeListener);
    return () => {
      appearanceListener.remove();
    };
  }, [changeTheme, colorScheme, isDark, themeChangeListener]);

  const handleColorSchemeChange = (newColorScheme: ColorSchemeName) => {
    if (newColorScheme) {
      changeTheme(newColorScheme);
      localStorage.setItem("disabledSystemTheme", "true");
    } else {
      localStorage.removeItem("disabledSystemTheme");
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
