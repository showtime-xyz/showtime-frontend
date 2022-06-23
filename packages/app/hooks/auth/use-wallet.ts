import { useMemo } from "react";

import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";

import getWeb3Modal from "app/lib/web3-modal.native";

const useWallet = () => {
  const { connected, accounts, killSession } = useWalletConnect();
  const signTypedDataAsync = async ({
    domain,
    types,
    value,
  }: {
    domain: any;
    types: any;
    value: any;
  }) => {
    const web3Modal = await getWeb3Modal();
    const web3 = new ethers.providers.Web3Provider(await web3Modal.connect());

    return await web3.getSigner()._signTypedData(domain, types, value);
  };

  const address = useMemo(
    () => accounts.find((a) => a.startsWith("0x")),
    [accounts]
  );

  return {
    address,
    disconnect: killSession,
    connected,
    loggedIn: null,
    networkChanged: null,
    signMessage: null,
    signed: null,
    provider: undefined,
    signature: null,
    signTypedDataAsync,
  };
};

export { useWallet };
