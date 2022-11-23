import { useEffect, useState, useCallback, useRef } from "react";
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
  const isFollowDeviceSetting = useRef(true);
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
  }, [isDark, themeChangeListener]);

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
