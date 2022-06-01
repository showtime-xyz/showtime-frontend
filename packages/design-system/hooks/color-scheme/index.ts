import { useEffect, useState } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const COLOR_SCHEME_STRING = "color-scheme";

export function setColorScheme(colorScheme: "light" | "dark") {
  storage.set(COLOR_SCHEME_STRING, colorScheme);
}

export function getColorScheme() {
  return storage.getString(COLOR_SCHEME_STRING) as "light" | "dark";
}

export function deleteColorScheme() {
  storage.delete(COLOR_SCHEME_STRING);
}

export function useColorScheme() {
  const deviceColorScheme = useDeviceColorScheme();
  const [colorScheme, setColorScheme] = useState(
    () => getColorScheme() ?? deviceColorScheme
  );

  useEffect(() => {
    const listener = storage.addOnValueChangedListener((changedKey) => {
      if (changedKey === COLOR_SCHEME_STRING) {
        const newValue = getColorScheme();
        setColorScheme(newValue);
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return colorScheme;
}
