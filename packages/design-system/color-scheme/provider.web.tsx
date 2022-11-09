import { useEffect, useState } from "react";
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
  const [openDeviceSetting, setOpenDeviceSetting] = useState(true);
  const [colorScheme, setColorScheme] = useState<"dark" | "light">(
    getPersistedColorScheme() ?? deviceColorScheme
  );
  const isDark = colorScheme === "dark";

  useEffect(() => {
    Appearance.addChangeListener((preferences) => {
      if (openDeviceSetting) {
        handleColorSchemeChange(preferences.colorScheme);
      }
    });
    document.documentElement.setAttribute(
      "data-color-scheme",
      isDark ? "dark" : "light"
    );
    if (isDark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDark, openDeviceSetting]);

  const handleColorSchemeChange = (newColorScheme: ColorSchemeName) => {
    if (newColorScheme) {
      setColorScheme(newColorScheme);
      persistColorScheme(newColorScheme);
      setOpenDeviceSetting(false);
    } else {
      setOpenDeviceSetting(true);
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
