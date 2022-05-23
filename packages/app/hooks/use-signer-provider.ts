import { Platform } from "react-native";

import { useAccount } from "wagmi";

import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";
import { getBiconomy } from "app/utilities";

import { useAlert } from "design-system/alert";

import { magic } from "../lib/magic";

export const useSignerAndProvider = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const { data: wagmiData } = useAccount();

  const getSignerAndProvider = async () => {
    const isWeb = Platform.OS === "web";
    let userAddress;

    if (web3) {
      userAddress = await web3.getSigner().getAddress();
    } else if (isWeb && wagmiData?.address) {
      userAddress = wagmiData.address;
    } else {
      // TODO: handle web differently
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
