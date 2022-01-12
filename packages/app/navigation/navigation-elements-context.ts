import { createContext } from "react";

type NavigationElementsType = {
  isHeaderHidden: boolean;
  setIsHeaderHidden: (isHeaderHidden: boolean) => void;
  isTabBarHidden: boolean;
  setIsTabBarHidden: (isTabBarHidden: boolean) => void;
};

const NavigationElementsContext = createContext({} as NavigationElementsType);
const NavigationElementsProvider = NavigationElementsContext.Provider;

export { NavigationElementsContext, NavigationElementsProvider };
