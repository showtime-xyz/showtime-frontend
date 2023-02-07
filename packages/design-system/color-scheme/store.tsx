import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const COLOR_SCHEME_STRING = "color-scheme";
const DISABLED_SYSTEM_THEME = "disabled-system-theme";

export function setColorScheme(colorScheme: "light" | "dark") {
  storage.set(COLOR_SCHEME_STRING, colorScheme);
}

export function getColorScheme() {
  return storage.getString(COLOR_SCHEME_STRING) as "light" | "dark";
}

export function deleteColorScheme() {
  storage.delete(COLOR_SCHEME_STRING);
}

export function getDisabledSystemTheme() {
  return storage.getString(DISABLED_SYSTEM_THEME);
}

export function setDisabledSystemTheme() {
  storage.set(DISABLED_SYSTEM_THEME, "true");
}

export function deleteDisabledSystemTheme() {
  storage.delete(DISABLED_SYSTEM_THEME);
}
