import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Create } from "app/components/create";

const CreateScreen = () => {
  useEffect(() => {
    mixpanel.track("Create page view");
  }, []);

  return <Create />;
};

export { CreateScreen };
