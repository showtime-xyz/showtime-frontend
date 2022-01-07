import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Profile } from "app/components/profile";

const ProfileScreen = () => {
  useEffect(() => {
    mixpanel.track("Profile view");
  }, []);

  return <Profile />;
};

export { ProfileScreen };
