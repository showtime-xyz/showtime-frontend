import React from "react";

import { ItemProps } from "./types";

type RootContextType = {
  value: string;
  handleValueChange: (value: string) => void;
};

export const RootContext = React.createContext(
  null as unknown as RootContextType
);
export const ItemContext = React.createContext(null as unknown as ItemProps);
