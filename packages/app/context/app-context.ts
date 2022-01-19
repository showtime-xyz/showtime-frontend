import { createContext } from "react";

type AppContextType = {
  web3: any;
  setWeb3: any;
  logOut: any;
  colorScheme: "light" | "dark";
  setColorScheme: (colorScheme: "light" | "dark") => void;
};

const AppContext = createContext({} as AppContextType);

export { AppContext };
