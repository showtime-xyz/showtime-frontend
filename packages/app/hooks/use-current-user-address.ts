import { useState, useContext, useEffect } from 'react'
import { useUser } from "app/hooks/use-user";
import { AppContext } from "app/context/app-context";

function useCurrentUserAddress() {
  const { user } = useUser();
  const [userAddress, setUserAddress] = useState('');
  const context = useContext(AppContext);

  useEffect(() => {
    if (
      user?.data &&
      user?.data.profile.wallet_addresses_v2[0]
    ) {
      setUserAddress(
        user.data.profile.wallet_addresses_v2[0].address
      );
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
