import { createContext } from "react";

type AppContextType = {
  colorScheme: "light" | "dark" | null | undefined;
  setColorScheme: (colorScheme: "light" | "dark") => void;
};

const AppContext = createContext({} as AppContextType);

export { AppContext };
