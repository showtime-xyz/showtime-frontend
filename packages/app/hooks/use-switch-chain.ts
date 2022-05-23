import React from "react";
import { Platform } from "react-native";

import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";
import { useWalletConnect } from "app/lib/walletconnect";
import { MATIC_CHAIN_DETAILS, MATIC_CHAIN_ID } from "app/utilities";

import { useAlert } from "design-system/alert";

export const useSwitchChain = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const [chain, setChain] = React.useState(null);

  React.useEffect(() => {
    async function setChainId() {
      const network = await web3?.getNetwork();
      if (network) {
        setChain(network);
        console.log("network dududue", network); // 42
      }
    }
    setChainId();
  }, [web3]);

  const switchChain = async () => {
    try {
      if (Platform.OS === "web") {
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
      } else if (connector.connected) {
        // TODO: this doesn't seem to be working!!
        await connector.updateChain({
          chainId: 137,
          networkId: 1,
          rpcUrl: "https://rpc-mainnet.maticvigil.com/",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
          },
        });
      }
    } catch (e) {
      Logger.error("error switching chain ", e);
    }
  };

  return { chain, switchChain };
};
