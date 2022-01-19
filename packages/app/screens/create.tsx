import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Create } from "app/components/create";
import { useRouter } from "app/navigation/use-router";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { Modal } from "design-system";

const CreateScreen = () => {
  useHideHeader();
  const router = useRouter();

  useEffect(() => {
    mixpanel.track("Create page view");
  }, []);

  return (
    <Modal title="Create" close={router.pop} height="h-[90vh]">
      <Create />
    </Modal>
  );
};

export { CreateScreen };
