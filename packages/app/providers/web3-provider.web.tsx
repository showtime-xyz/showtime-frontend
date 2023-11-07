// @ts-expect-error
import { Web3Provider as Web3ProviderBase } from "./web3-provider.tsx";

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return <Web3ProviderBase>{children}</Web3ProviderBase>;
}
