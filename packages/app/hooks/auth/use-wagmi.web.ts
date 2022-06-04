import { useMemo } from "react";

import {
  useAccount,
  useSignMessage,
  useSigner,
  useNetwork,
  useSignTypedData,
} from "wagmi";

const useWagmi = () => {
  const { data: wagmiData } = useAccount();
  const { data: wagmiSignData, signMessage } = useSignMessage();
  const { data: wagmiSigner } = useSigner();
  const { activeChain } = useNetwork();
  const { signTypedDataAsync } = useSignTypedData();

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
    address: wagmiData?.address,
    connected,
    signed,
    loggedIn,
    networkChanged,
    provider: wagmiSigner?.provider,
    signature: wagmiSignData,
    signMessage,
    signTypedDataAsync,
  };
};

export { useWagmi };
