import { useEffect, useCallback, useState } from "react";

import { useAccount } from "wagmi";

import { useUser } from "app/hooks/use-user";

function useCurrentUserAddress() {
  const { data: wagmiData } = useAccount();
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState("");

  const getCurrentUserAddress = useCallback(async () => {
    if (wagmiData?.address) {
      setUserAddress(wagmiData?.address);
    } else if (user?.data && user?.data.profile.wallet_addresses_v2[0]) {
      setUserAddress(user.data.profile.wallet_addresses_v2[0].address);
    } else {
      setUserAddress("");
    }
  }, [user, wagmiData]);

  useEffect(() => {
    getCurrentUserAddress();
  }, [getCurrentUserAddress]);

  return { userAddress };
}

export { useCurrentUserAddress };
