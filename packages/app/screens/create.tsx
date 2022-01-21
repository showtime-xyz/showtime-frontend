import { useEffect, useMemo } from "react";
import { Platform } from "react-native";

import { mixpanel } from "app/lib/mixpanel";
import { Create } from "app/components/create";
import { useRouter } from "app/navigation/use-router";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { Modal, ModalSheet } from "design-system";
import { createParam } from "app/navigation/use-param";

type Query = {
  uri: string;
};

const { useParam } = createParam<Query>();

const CreateScreen = () => {
  useHideHeader();
  const router = useRouter();
  const [uri, setUri] = useParam("uri");

  useEffect(() => {
    mixpanel.track("Create page view");
  }, []);

  const snapPoints = useMemo(() => ["90%"], []);

  const CreateModal = Platform.OS === "android" ? ModalSheet : Modal;

  return (
    <CreateModal
      title="Create"
      close={router.pop}
      snapPoints={snapPoints}
      height="h-[90vh]"
    >
      <Create uri={uri} />
    </CreateModal>
  );
};

export { CreateScreen };
