import { createContext, Dispatch } from "react";

import {
  MintNFTType,
  ActionPayload,
  MintActionType,
} from "app/hooks/use-mint-nft";

type MintContextType = {
  state: MintNFTType;
  dispatch: Dispatch<{
    type: MintActionType;
    payload?: ActionPayload;
  }>;
};

const MintContext = createContext({} as MintContextType);

export { MintContext };
