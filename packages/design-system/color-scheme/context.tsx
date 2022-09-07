import { createContext } from "react";

type ColorScheme = "light" | "dark" | null | undefined;

type SetColorScheme = (colorScheme: ColorScheme) => void;

export const ColorSchemeContext = createContext(
  null as unknown as {
    colorScheme: ColorScheme;
    setColorScheme: SetColorScheme;
  }
);
