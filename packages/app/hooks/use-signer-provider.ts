import { Platform } from "react-native";

import { useAccount } from "wagmi";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";
import { getBiconomy } from "app/utilities";

export const useSignerAndProvider = () => {
  const connector = useWalletConnect();
  let { web3 } = useWeb3();
  const Alert = useAlert();
  const { data: wagmiData } = useAccount();

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
    if (wagmiData) {
      userAddress = wagmiData.address;
    } else if (Platform.OS !== "web" && web3) {
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
