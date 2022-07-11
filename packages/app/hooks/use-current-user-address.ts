import { useEffect, useState } from "react";

import { useWallet } from "app/hooks/auth/use-wallet";
import { useWeb3 } from "app/hooks/use-web3";

function useCurrentUserAddress() {
  const [userAddress, setUserAddress] = useState("");
  const { address } = useWallet();
  const { web3 } = useWeb3();

  useEffect(() => {
    (async function fetchUserAddress() {
      if (address) {
        setUserAddress(address);
      } else if (web3) {
        const userAddress = await web3.getSigner().getAddress();
        setUserAddress(userAddress);
      } else {
        setUserAddress("");
      }
    })();
  }, [web3, address]);

  return { userAddress };
}

export { useCurrentUserAddress };
