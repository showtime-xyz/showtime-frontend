import { createContext } from "react";

export const ReactionContext = createContext(
  null as unknown as {
    visible: boolean;
    setVisible: (v: boolean) => void;
    setPosition: (v: { top: number; left: number }) => void;
    setReactions: (v: any) => void;
  }
);
