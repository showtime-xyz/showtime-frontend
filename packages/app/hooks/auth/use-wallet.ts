import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { ethers } from "ethers";

import { useWeb3 } from "app/hooks/use-web3";
import getWeb3Modal from "app/lib/web3-modal.native";

const useWallet = () => {
  const { connected, killSession, session } = useWalletConnect();
  const { isMagic } = useWeb3();
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

  return {
    address: connected ? ethers.utils.getAddress(session.accounts[0]) : null,
    disconnect: killSession,
    connected: connected || isMagic,
    networkChanged: null,
    signMessage: null,
    signed: null,
    provider: undefined,
    signature: null,
    signTypedDataAsync,
  };
};

export { useWallet };
