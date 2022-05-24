import React from "react";

import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";
import { useWalletConnect } from "app/lib/walletconnect";
import { MATIC_CHAIN_DETAILS, MATIC_CHAIN_ID } from "app/utilities";

import { useAlert } from "design-system/alert";

export const useSwitchNetwork = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const [network, setNetwork] = React.useState<{ chainId: number, name: string } | null>(null);

  React.useEffect(() => {
    (async function fetchNetwork() {
      const network = await web3?.getNetwork();
      if (network) {
        setNetwork(network);
      }
    })()
  }, [web3]);

  const switchNetwork = async () => {
    try {
      try {
        await web3?.provider?.request?.({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${MATIC_CHAIN_ID.toString(16)}` }],
        });
      } catch (error: any) {
        Logger.error(error);
        if (error.code === 4902) {
          try {
            await web3?.provider?.request?.({
              method: "wallet_addEthereumChain",
              params: [MATIC_CHAIN_DETAILS],
            });
          } catch (error) {
            Logger.error(error);
            Alert.alert(
              "something went wrong while switching network",
              "Please manually try to switch to polygon network"
            );
          }
        }
      }
    } catch (e) {
      Logger.error("error switching network ", e);
    }
  };

  return { network, switchNetwork };
};
