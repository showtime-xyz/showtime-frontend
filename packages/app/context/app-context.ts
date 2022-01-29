import { createContext } from "react";

type AppContextType = {
  colorScheme: "light" | "dark";
  setColorScheme: (colorScheme: "light" | "dark") => void;
  setMountRelayerOnApp: (hide: boolean) => void;
};

const AppContext = createContext({} as AppContextType);

export { AppContext };
