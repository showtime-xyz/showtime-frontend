import { Platform } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";

import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";
import getWeb3Modal from "app/lib/web3-modal";
import { getBiconomy } from "app/utilities";

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
