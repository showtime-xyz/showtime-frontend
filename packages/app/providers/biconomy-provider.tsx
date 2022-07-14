import { useEffect, useState, createContext } from "react";

import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useWeb3 } from "app/hooks/use-web3";
import { getBiconomy } from "app/utilities";

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
      const biconomy = await (await getBiconomy(connector, web3)).biconomy;
      const value = {
        signer: biconomy.getSignerByAddress(userAddress),
        provider: biconomy.getEthersProvider(),
        signerAddress: userAddress,
      };

      setContextValue(value);
    }

    initializeSigner();
  }, [web3, connector, userAddress]);

  return (
    <BiconomyContext.Provider value={contextValue}>
      {children}
    </BiconomyContext.Provider>
  );
};
