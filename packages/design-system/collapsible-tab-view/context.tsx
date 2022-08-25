import React, { useContext } from "react";

import type { TabHeaderContext } from "./types";

export const HeaderTabContext = React.createContext<TabHeaderContext>(null);

export const useHeaderTabContext = () => {
  const ctx = useContext(HeaderTabContext);
  if (!ctx) throw new Error("HeaderTabContext not found");
  return ctx;
};
