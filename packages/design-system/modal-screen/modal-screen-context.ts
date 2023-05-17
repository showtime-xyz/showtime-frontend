import { useContext, createContext } from "react";

import { ModalScreenContextValue } from "./types";

export const useModalScreenContext = () => {
  const context = useContext(ModalScreenContext);

  return context;
};

export const ModalScreenContext = createContext<ModalScreenContextValue>(null);
