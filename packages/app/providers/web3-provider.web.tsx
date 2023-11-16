import { useAccount, useWalletClient } from "wagmi";

// @ts-expect-error
import { Web3Provider as Web3ProviderBase } from "./web3-provider.tsx";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const { isConnected } = useAccount();
  const signer = useWalletClient();

  return (
    <Web3ProviderBase connected={isConnected} client={signer.data}>
      {children}
    </Web3ProviderBase>
  );
}
