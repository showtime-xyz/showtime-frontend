import React from "react";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";
import { MATIC_CHAIN_DETAILS, MATIC_CHAIN_ID } from "app/utilities";

export const useSwitchNetwork = () => {
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const [network, setNetwork] = React.useState<{
    chainId: number;
    name: string;
  } | null>(null);

  React.useEffect(() => {
    (async function fetchNetwork() {
      const network = await web3?.getNetwork();
      if (network) {
        setNetwork(network);
      }
    })();
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
        if (
          error.code === 4902 ||
          (error.message && error.message.includes("chain"))
        ) {
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
          throw error;
        }
        throw error;
      }
    } catch (e) {
      Logger.error("error switching network ", e);
      throw e;
    }
  };

  return { network, switchNetwork };
};
