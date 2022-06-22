import { useEffect, useState } from "react";

import { useAccount, useNetwork } from "wagmi";

import { useUser } from "./use-user";

function useCurrentUserAddress() {
  const { data: wagmiData } = useAccount();
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState("");
  const { activeChain } = useNetwork();

  useEffect(() => {
    if (wagmiData?.address) {
      setUserAddress(wagmiData?.address);
    } else if (user?.data && user?.data.profile.wallet_addresses_v2[0]) {
      setUserAddress(user.data.profile.wallet_addresses_v2[0].address);
    } else {
      setUserAddress("");
    }
  }, [activeChain, wagmiData, user?.data]);

  return { userAddress };
}

export { useCurrentUserAddress };
