import { useWallet } from "app/hooks/use-wallet";

function useCurrentUserAddress() {
  const { address } = useWallet();

  return { userAddress: address };
}

export { useCurrentUserAddress };
