import React, { createContext, useContext } from "react";

type ColorScheme = "light" | "dark" | null | undefined;

type SetColorScheme = (colorScheme: ColorScheme) => void;

export const ColorSchemeContext = createContext(
  null as unknown as {
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

export const useColorScheme = () => {
  const colorSchemeContext = useContext(ColorSchemeContext);
  if (!colorSchemeContext) {
    console.error(
      "Please wrap your app with <ColorSchemeProvider> from @showtime-xyz/universal.color-scheme"
    );
  }
  return colorSchemeContext;
};
