import { createContext, Dispatch } from "react";

import {
  MintNFTType,
  MintNFTStatus,
  ActionPayload,
} from "app/hooks/use-mint-nft";

type MintContextType = {
  state: MintNFTType;
  dispatch: Dispatch<{
    type: MintNFTStatus;
    payload?: ActionPayload;
  }>;
};

const MintContext = createContext({} as MintContextType);

export { MintContext };
