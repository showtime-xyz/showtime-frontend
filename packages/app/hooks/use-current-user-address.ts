import { useEffect, useCallback, useState } from "react";

import { useUser } from "app/hooks/use-user";
import { useWalletConnect } from "app/lib/walletconnect";

function useCurrentUserAddress() {
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState("");
  const connector = useWalletConnect();
  const connectedAddress = connector?.session?.accounts[0];

  const getCurrentUserAddress = useCallback(async () => {
    if (connector?.connected && connectedAddress) {
      setUserAddress(connectedAddress);
    } else if (user?.data && user?.data.profile.wallet_addresses_v2[0]) {
      setUserAddress(user.data.profile.wallet_addresses_v2[0].address);
    } else {
      setUserAddress("");
    }
  }, [user, connectedAddress, connector?.connected]);

  useEffect(() => {
    getCurrentUserAddress();
  }, [getCurrentUserAddress]);

  return { userAddress };
}

export { useCurrentUserAddress };
