const COLOR_SCHEME_STRING = "color-scheme";

export function setColorScheme(colorScheme: "light" | "dark") {
  localStorage.setItem(COLOR_SCHEME_STRING, colorScheme);
}

export function getColorScheme() {
  return localStorage.getItem(COLOR_SCHEME_STRING) as "light" | "dark";
}

export function deleteColorScheme() {
  localStorage.removeItem(COLOR_SCHEME_STRING);
}

export function useColorScheme() {
  // TODO: implement a storage listener

  return getColorScheme();
}
