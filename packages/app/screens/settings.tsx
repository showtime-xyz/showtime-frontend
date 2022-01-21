import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Settings } from "app/components/settings";
import { createParam } from "../navigation/use-param";

type Query = {
  walletAddress: string;
};

const { useParam } = createParam<Query>();

const SettingsScreen = () => {
  useEffect(() => {
    mixpanel.track("Settings view");
  }, []);

  const [walletAddress, setWalletAddress] = useParam("walletAddress");

  return <Settings />;
};

export { SettingsScreen };
