import { ReactNode, useReducer, useMemo } from "react";

import { DropContext } from "app/context/drop-context";
import { reducer, initialState } from "app/hooks/use-drop-nft";

type DropProviderProps = {
  children: ReactNode;
};

export function DropProvider({ children }: DropProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const values = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [dispatch, state]
  );

  return <DropContext.Provider value={values}>{children}</DropContext.Provider>;
}
