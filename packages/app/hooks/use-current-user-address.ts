import { useWallet } from "app/hooks/auth/use-wallet";

function useCurrentUserAddress() {
  const { address } = useWallet();

  return { userAddress: address };
}

export { useCurrentUserAddress };
