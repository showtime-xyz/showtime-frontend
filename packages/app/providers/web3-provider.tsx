import { useMemo, useState } from "react";
import type { Web3Provider as Web3ProviderType } from "@ethersproject/providers";
import { Web3Context } from "app/context/web3-context";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  //#region state
  const [web3, setWeb3] = useState<Web3ProviderType | undefined>(undefined);
  //#endregion

  //#region variables
  const Web3ContextValue = useMemo(
    () => ({
      web3,
      setWeb3,
    }),
    [web3]
  );
  //#endregion
  return (
    <Web3Context.Provider value={Web3ContextValue}>
      {children}
    </Web3Context.Provider>
  );
}
