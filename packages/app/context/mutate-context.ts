import { createContext, useContext } from "react";

import { NFT } from "app/types";

type MutateContextType = {
  mutate: (nft: NFT) => void;
};

const MutateContext = createContext({
  mutate: () => {},
} as MutateContextType);

export const useMutateContext = () => {
  return useContext(MutateContext);
};

export { MutateContext };
