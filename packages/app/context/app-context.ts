import { createContext } from "react";

type AppContextType = {
  colorScheme: "light" | "dark";
  setColorScheme: (colorScheme: "light" | "dark") => void;
};

const AppContext = createContext({} as AppContextType);

export { AppContext };
