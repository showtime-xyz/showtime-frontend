import { useEffect, useCallback, useState } from "react";

import { useAccount, useNetwork } from "wagmi";

import { useUser } from "app/hooks/use-user";

function useCurrentUserAddress() {
  const { data: wagmiData } = useAccount();
  const [userAddress, setUserAddress] = useState("");
  const { activeChain } = useNetwork();

  useEffect(() => {
    if (wagmiData?.address) {
      setUserAddress(wagmiData?.address);
    } else {
      setUserAddress("");
    }
  }, [activeChain, wagmiData]);

  return { userAddress };
}

export { useCurrentUserAddress };
