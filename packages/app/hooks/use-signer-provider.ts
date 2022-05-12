import { Alert, Platform } from "react-native";

import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";

import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import { useWalletConnect } from "app/lib/walletconnect";
import getWeb3Modal from "app/lib/web3-modal";
import {
  getBiconomy,
  MATIC_CHAIN_DETAILS,
  MATIC_CHAIN_ID,
} from "app/utilities";

import { useAlert } from "design-system/alert";

export const useSignerAndProvider = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const getSignerAndProvider = async () => {
    let userAddress;
    if (web3) {
      const addr = await web3.getSigner().getAddress();
      userAddress = addr;
    } else if (Platform.OS === "web") {
      const Web3Provider = (await import("@ethersproject/providers"))
        .Web3Provider;
      const web3Modal = await getWeb3Modal();
      web3 = new Web3Provider(await web3Modal.connect());
      const addr = await web3.getSigner().getAddress();
      userAddress = addr;
    } else {
      if (connector.connected) {
        [userAddress] = connector.accounts.filter((addr) =>
          addr.startsWith("0x")
        );
      } else {
        connector.connect();
        console.log("Not connected to wallet, sending connect request");
        return;
      }
    }
    if (!userAddress) {
      Alert.alert("Sorry! seems like you are not connected to the wallet");
      return;
    }
    const biconomy = await (await getBiconomy(connector, web3)).biconomy;
    return {
      signer: biconomy.getSignerByAddress(userAddress),
      provider: biconomy.getEthersProvider(),
      signerAddress: userAddress,
      web3,
    };
  };
  return { getSignerAndProvider };
};

export const useSignTypedData = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const switchChain = useUpdateChain();

  const signTypedData = async (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ) => {
    // magic or web
    try {
      if (web3) {
        const result = await web3
          .getSigner()
          ._signTypedData(domain, types, value);
        return result;
      } else if (Platform.OS === "web") {
        const Web3Provider = (await import("@ethersproject/providers"))
          .Web3Provider;
        const web3Modal = await getWeb3Modal();
        web3 = new Web3Provider(await web3Modal.connect());
        const result = await web3
          .getSigner()
          ._signTypedData(domain, types, value);
        return result;
      }
      // native
      else if (connector.connected) {
        const [userAddress] = connector.accounts.filter((addr) =>
          addr.startsWith("0x")
        );
        const res = await connector.signTypedData([
          userAddress,
          JSON.stringify({ domain, types, value }),
        ]);
        return res;
      } else {
        connector.connect();
        console.log("Not connected to wallet, sending connect request");
      }
    } catch (e: any) {
      captureException(e);
      Logger.error("signing failed with erro", e);
      if (
        e.code === -32603 ||
        (typeof e.message === "string" && e.message.includes("chainId"))
      ) {
        Alert.alert(
          "Switch network chain id",
          "Wallet chain id must point to polygon network",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Switch chain",
              onPress: () => switchChain(),
            },
          ]
        );
      }
    }
  };

  return signTypedData;
};

const useUpdateChain = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();

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
          captureException(error);
          if (error.code === 4902) {
            try {
              await web3?.provider?.request?.({
                method: "wallet_addEthereumChain",
                params: [MATIC_CHAIN_DETAILS],
              });
            } catch (error) {
              Logger.error(error);
              captureException(error);
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
      captureException(e);
      Logger.error("error switching chain ", e);
    }
  };

  return switchChain;
};
