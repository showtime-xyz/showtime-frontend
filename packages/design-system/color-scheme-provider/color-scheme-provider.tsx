import * as React from "react";

type ColorScheme = "light" | "dark" | null | undefined;

type SetColorScheme = (colorScheme: ColorScheme) => void;

export const ColorSchemeContext = React.createContext(
  {} as unknown as {
    colorScheme: ColorScheme;
    setColorScheme: SetColorScheme;
  }
);

export const ColorSchemeProvider = ({
  children,
  colorScheme,
  setColorScheme,
}: {
  children: React.ReactChild | React.ReactNode;
  colorScheme: ColorScheme;
  setColorScheme: SetColorScheme;
}) => {
  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};
