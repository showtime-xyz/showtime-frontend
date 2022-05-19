import { useMemo } from "react";

import { MutateContext } from "app/context/mutate-context";
import { NFT } from "app/types";

export const MutateProvider = ({
  children,
  mutate,
}: {
  children: any;
  mutate: (nft: NFT) => void;
}) => {
  return (
    <MutateContext.Provider value={useMemo(() => ({ mutate }), [mutate])}>
      {children}
    </MutateContext.Provider>
  );
};
