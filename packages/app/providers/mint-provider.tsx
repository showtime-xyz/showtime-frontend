import { ReactNode, useReducer } from "react";
import { Platform } from "react-native";

import { MintContext } from "app/context/mint-context";
import { mintNFTReducer, initialMintNFTState } from "app/hooks/use-mint-nft";

type MintProviderProps = {
  children: ReactNode;
};

export function MintProvider({ children }: MintProviderProps) {
  const [state, dispatch] = useReducer(mintNFTReducer, initialMintNFTState);

  return (
    <MintContext.Provider value={{ state, dispatch }}>
      {children}
    </MintContext.Provider>
  );
}
