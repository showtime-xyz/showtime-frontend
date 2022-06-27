import { useEffect, useCallback, useState } from "react";

import { useWallet } from "app/hooks/auth/use-wallet";
import { useUser } from "app/hooks/use-user";

function useCurrentUserAddress() {
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState("");
  const { address } = useWallet();

  const getCurrentUserAddress = useCallback(async () => {
    if (address) {
      setUserAddress(address);
    } else if (user?.data && user?.data.profile.wallet_addresses_v2[0]) {
      setUserAddress(user.data.profile.wallet_addresses_v2[0].address);
    } else {
      setUserAddress("");
    }
  }, [user, address]);

  useEffect(() => {
    getCurrentUserAddress();
  }, [getCurrentUserAddress]);

  return { userAddress };
}

export { useCurrentUserAddress };
