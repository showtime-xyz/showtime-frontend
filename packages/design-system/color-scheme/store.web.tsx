const COLOR_SCHEME_STRING = "color-scheme";
const DISABLED_SYSTEM_THEME = "disabled-system-theme";

export function setColorScheme(colorScheme: "light" | "dark") {
  if (typeof window !== "undefined") {
    localStorage.setItem(COLOR_SCHEME_STRING, colorScheme);
  }
}

export function getColorScheme() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(COLOR_SCHEME_STRING) as "light" | "dark";
  }
}

export function deleteColorScheme() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(COLOR_SCHEME_STRING);
  }
}

export function getDisabledSystemTheme() {
  return localStorage.getItem(DISABLED_SYSTEM_THEME);
}

export function setDisabledSystemTheme() {
  localStorage.setItem(DISABLED_SYSTEM_THEME, "true");
}

export function deleteDisabledSystemTheme() {
  localStorage.removeItem(DISABLED_SYSTEM_THEME);
}
