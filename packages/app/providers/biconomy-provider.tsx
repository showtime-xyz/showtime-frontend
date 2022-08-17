import { useEffect, useState, createContext } from "react";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import { useWalletConnect } from "app/lib/walletconnect";

type BiconomyContextValue = {
  signer: any;
  provider: any;
  signerAddress: any;
} | null;

export const BiconomyContext = createContext(null as BiconomyContextValue);

export const BiconomyProvider = ({ children }: { children: any }) => {
  const connector = useWalletConnect();
  const { web3 } = useWeb3();
  const { userAddress } = useCurrentUserAddress();

  const [contextValue, setContextValue] = useState<BiconomyContextValue>(null);

  useEffect(() => {
    async function initializeSigner() {
      try {
        const value = {
          signer: web3?.getSigner(),
          provider: web3,
          signerAddress: userAddress,
        };

        setContextValue(value);
      } catch (e: any) {
        captureException(e);
        setContextValue(null);
        Logger.error("Biconomy initialisation failed ", e);
      }
    }

    initializeSigner();
  }, [web3, connector, userAddress]);

  return (
    <BiconomyContext.Provider value={contextValue}>
      {children}
    </BiconomyContext.Provider>
  );
};
