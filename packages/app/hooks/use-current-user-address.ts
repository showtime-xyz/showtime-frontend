import { useState, useContext, useEffect } from "react";

import { AppContext } from "app/context/app-context";
import { useUser } from "app/hooks/use-user";
import { useWalletConnect } from "app/lib/walletconnect";

function useCurrentUserAddress() {
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState("");
  const context = useContext(AppContext);
  const connector = useWalletConnect();
  const [connectedAddress] = connector?.session?.accounts;

  useEffect(() => {
    if (connector.connected && connectedAddress) {
      setUserAddress(connectedAddress);
    } else if (user?.data && user?.data.profile.wallet_addresses_v2[0]) {
      setUserAddress(user.data.profile.wallet_addresses_v2[0].address);
    }
    // Web3 is initialised for magic users
    else if (context.web3) {
      const signer = context.web3.getSigner();
      signer.getAddress().then((addr: string) => {
        setUserAddress(addr);
      });
    }
  }, [user, context.web3]);

  return { userAddress };
}

export { useCurrentUserAddress };
