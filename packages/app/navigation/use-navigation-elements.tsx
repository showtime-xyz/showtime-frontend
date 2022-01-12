import { useEffect, useContext } from "react";
import { Platform } from "react-native";

import { NavigationElementsContext } from "./navigation-elements-context";

export function useNavigationElements() {
  const {
    isHeaderHidden,
    setIsHeaderHidden,
    isTabBarHidden,
    setIsTabBarHidden,
  } = useContext(NavigationElementsContext);

  return {
    isHeaderHidden,
    setIsHeaderHidden,
    isTabBarHidden,
    setIsTabBarHidden,
  };
}

export function useHideNavigationElements() {
  const { setIsHeaderHidden, setIsTabBarHidden } = useNavigationElements();

  useEffect(() => {
    if (Platform.OS !== "ios") {
      setIsHeaderHidden(true);
      setIsTabBarHidden(true);

      return () => {
        setIsHeaderHidden(false);
        setIsTabBarHidden(false);
      };
    }
  }, []);
}
