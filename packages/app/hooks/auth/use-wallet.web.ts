import { useMemo } from "react";

import {
  useAccount,
  useSignMessage,
  useSigner,
  useNetwork,
  useSignTypedData,
  useDisconnect,
} from "wagmi";

const useWallet = () => {
  const { data: wagmiData } = useAccount();
  const { data: wagmiSignData, signMessage } = useSignMessage();
  const { data: wagmiSigner } = useSigner();
  const { activeChain } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();
  const { disconnect } = useDisconnect();

  const getAddress = async () => {
    return wagmiData?.address;
  };

  const connected = useMemo(
    () => !!wagmiData && !!activeChain && !!wagmiSigner?.provider,
    [wagmiData, activeChain, wagmiSigner?.provider]
  );
  const networkChanged = useMemo(
    () => !!activeChain && activeChain.id !== 137,
    [activeChain]
  );
  const signed = useMemo(() => !!wagmiSignData, [wagmiSignData]);
  const loggedIn = useMemo(() => connected, [connected]);

  return {
    getAddress,
    address: wagmiData?.address,
    connected,
    signed,
    loggedIn,
    disconnect,
    networkChanged,
    provider: wagmiSigner?.provider,
    signature: wagmiSignData,
    signMessage,
    signTypedDataAsync,
  };
};

export { useWallet };
