import { useEffect, useState } from "react";

import { useAccount, useNetwork } from "wagmi";

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
