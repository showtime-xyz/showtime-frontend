import { Alert } from "react-native";

import { useWeb3 } from "app/hooks/use-web3";
import { useWalletConnect } from "app/lib/walletconnect";
import { getBiconomy } from "app/utilities";

export const useSignerAndProvider = () => {
  const connector = useWalletConnect();

  const { web3 } = useWeb3();

  const getSignerAndProvider = async () => {
    let userAddress;
    const isMagic = !!web3;
    if (isMagic) {
      const signer = web3.getSigner();
      const addr = await signer.getAddress();
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
    };
  };

  return { getSignerAndProvider };
};
