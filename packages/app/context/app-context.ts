import { createContext } from "react";

type AppContextType = {
  web3: any;
  setWeb3: any;
  logOut: any;
};

const AppContext = createContext({} as AppContextType);

export { AppContext };
