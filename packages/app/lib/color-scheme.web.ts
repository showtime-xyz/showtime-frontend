import { useEffect, useState } from "react";

const COLOR_SCHEME_STRING = "color-scheme";
let listeners: any = [];

export function setColorScheme(colorScheme: "light" | "dark") {
  if (typeof window !== "undefined") {
    localStorage.setItem(COLOR_SCHEME_STRING, colorScheme);
    listeners.forEach((listener: any) => listener(colorScheme));
  }
}

export function getColorScheme() {
  if (typeof window !== "undefined")
    return localStorage.getItem(COLOR_SCHEME_STRING) as "light" | "dark";
}

export function deleteColorScheme() {
  if (typeof window !== "undefined")
    localStorage.removeItem(COLOR_SCHEME_STRING);
}

export function useColorScheme() {
  const [, setCount] = useState(0);
  useEffect(() => {
    const callback = () => {
      setCount((c) => c + 1);
    };
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((l: any) => l !== callback);
    };
  }, []);

  return getColorScheme();
}
