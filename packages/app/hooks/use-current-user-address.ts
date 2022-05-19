import { useEffect, useState, useCallback } from "react";

import { useAccount } from "wagmi";

import { useUser } from "app/hooks/use-user";
import { useWalletConnect } from "app/lib/walletconnect";

/**
 * To avoid address collision this hook will maintain the active address.
 * In the unexpected event of multiple active providers the preference order for address
 * selection will be 1st wallet connect 2nd magic then if provided the first address in `profile.wallet_addresses_v2`
 */
function useCurrentUserAddress() {
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState("");
  const connector = useWalletConnect();
  const { data: wagmiData } = useAccount();
  const connectedAddress = connector?.session?.accounts[0];

  const updateAddress = useCallback(
    (newAddress: string) => {
      if (!newAddress || !userAddress || userAddress !== newAddress) {
        setUserAddress(newAddress);
      }
    },
    [userAddress, setUserAddress]
  );

  useEffect(() => {
    if (connector?.connected && connectedAddress) {
      updateAddress(connectedAddress);
    } else if (wagmiData?.address) {
      updateAddress(wagmiData.address);
    } else if (user?.data && user?.data.profile.wallet_addresses_v2[0]) {
      updateAddress(user.data.profile.wallet_addresses_v2[0].address);
    } else {
      updateAddress("");
    }
  }, [user, updateAddress, connectedAddress, connector?.connected, wagmiData]);

  return { userAddress };
}

export { useCurrentUserAddress };
