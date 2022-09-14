import { createContext } from "react";
import type { ColorSchemeName } from "react-native";

type SetColorScheme = (colorScheme: ColorSchemeName) => void;

export const ColorSchemeContext = createContext(
  null as unknown as {
    colorScheme: ColorSchemeName;
    setColorScheme: SetColorScheme;
  }
);
