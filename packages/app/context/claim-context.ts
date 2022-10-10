import { createContext, Dispatch } from "react";

import { State, Action } from "app/hooks/use-claim-nft";

type ClaimContextType = {
  state: State;
  dispatch: Dispatch<Action>;
  pollTransaction: (transactionId: any, contractAddress: any) => Promise<void>;
};

const ClaimContext = createContext({} as ClaimContextType);

export { ClaimContext };
