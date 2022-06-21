import { createContext } from "react";

export const TrendingContext = createContext<{
  [index: number]: number;
}>({});
