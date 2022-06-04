import { useMemo } from "react";

import { ethers } from "ethers";

import getWeb3Modal from "app/lib/web3-modal.native";

const useWallet = () => {
  const address = useMemo(async () => {
    const web3Modal = await getWeb3Modal();
    const web3 = new ethers.providers.Web3Provider(await web3Modal.connect());
    return await web3.getSigner().getAddress();
  }, []);

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
    address,
    connected: false,
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
