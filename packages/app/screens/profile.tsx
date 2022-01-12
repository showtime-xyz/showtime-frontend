import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Profile } from "app/components/profile";
import { createParam } from "../navigation/use-param";

type Query = {
  walletAddress: string;
};

const { useParam } = createParam<Query>();

const ProfileScreen = () => {
  useEffect(() => {
    mixpanel.track("Profile view");
  }, []);

  const [walletAddress, setWalletAddress] = useParam("walletAddress");

  return <Profile walletAddress={walletAddress as string} />;
};

export { ProfileScreen };
