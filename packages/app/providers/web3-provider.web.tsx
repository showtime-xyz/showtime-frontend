import { useAccount, useSigner } from "wagmi";

// @ts-expect-error
import { Web3Provider as Web3ProviderBase } from "./web3-provider.tsx";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const { isConnected } = useAccount();
  const signer = useSigner();

  return (
    <Web3ProviderBase connected={isConnected} provider={signer.data?.provider}>
      {children}
    </Web3ProviderBase>
  );
}
