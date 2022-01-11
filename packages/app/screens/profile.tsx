import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Profile } from "app/components/profile";
import { useRouter } from "../navigation/use-router";

const ProfileScreen = () => {
  useEffect(() => {
    mixpanel.track("Profile view");
  }, []);

  const router = useRouter();
  const walletAddress = router.pathname.split("/")[2];

  return <Profile walletAddress={walletAddress} />;
};

export { ProfileScreen };
