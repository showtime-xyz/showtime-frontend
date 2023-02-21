import { useContext, createContext } from "react";

export const useModalScreenContext = () => {
  const context = useContext(ModalScreenContext);

  return context;
};

type ModalScreenContextValue = {
  setTitle: (title: string) => void;
};

export const ModalScreenContext = createContext<ModalScreenContextValue | null>(
  null
);
