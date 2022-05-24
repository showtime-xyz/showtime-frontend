import { Platform } from "react-native";

import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";

import { useWeb3 } from "app/hooks/use-web3";
import { Logger } from "app/lib/logger";
import { useWalletConnect } from "app/lib/walletconnect";
import getWeb3Modal from "app/lib/web3-modal";
import { getBiconomy } from "app/utilities";

import { useAlert } from "design-system/alert";

import { useSwitchNetwork } from "./use-switch-network";

export const useSignerAndProvider = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const getSignerAndProvider = async () => {
    let userAddress = await getUserAddress();
    const biconomy = await (await getBiconomy(connector, web3)).biconomy;
    return {
      signer: biconomy.getSignerByAddress(userAddress),
      provider: biconomy.getEthersProvider(),
      signerAddress: userAddress,
      web3,
    };
  };

  const getUserAddress = async () => {
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
    return userAddress;
  };

  return { getSignerAndProvider, getUserAddress };
};

export const useSignTypedData = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const { switchNetwork } = useSwitchNetwork();

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
      }
    } catch (e: any) {
      Logger.error("signing failed with error", e);
      if (
        e.code === -32603 ||
        (typeof e.message === "string" && e.message.includes("chainId"))
      ) {
        Alert.alert(
          "Switch network",
          "Wallet must point to polygon network to complete the transaction",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Switch chain",
              onPress: async () => {
                try {
                  await switchNetwork()
                } catch (e) {
                  Alert.alert("Network switching failed", "Please switch network to polygon in your wallet and try again.")
                }

              }
            },
          ]
        );
      }
    }
  };

  return signTypedData;
};
