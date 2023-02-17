import { createContext, Dispatch } from "react";

import { State, Action } from "app/hooks/use-drop-nft";

type DropContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

const DropContext = createContext({} as DropContextType);

export { DropContext };
