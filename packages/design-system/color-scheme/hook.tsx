import { useContext } from "react";

import { ColorSchemeContext } from "./context";

export const useColorScheme = () => {
  const colorSchemeContext = useContext(ColorSchemeContext);

  if (!colorSchemeContext) {
    console.error(
      "Please wrap your app with <ColorSchemeProvider> from design-system/color-scheme"
    );
  }
  return colorSchemeContext;
};
