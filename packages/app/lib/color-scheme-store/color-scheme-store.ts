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
