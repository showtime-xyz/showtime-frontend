import { useContext, useEffect, useMemo } from "react";
import { Alert, Platform } from "react-native";

import { Create } from "app/components/create";
import { MintContext } from "app/context/mint-context";
import { mixpanel } from "app/lib/mixpanel";
import { useNavigation } from "app/lib/react-navigation/native";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";
import { withModalScreen } from "app/navigation/with-modal-screen";

import { Modal, ModalSheet } from "design-system";

type Query = {
  form: string;
};

const { useParam } = createParam<Query>();
const CreateModal = () => {
  useHideHeader();
  //#region hooks
  const router = useRouter();
  const navigation = useNavigation();
  const [form] = useParam("form");
  const { state } = useContext(MintContext);
  //#endregion

  //#region variables
  const snapPoints = useMemo(() => ["90%"], []);
  const ModalComponent = Platform.OS === "android" ? ModalSheet : Modal;
  //#endregion

  //#region effects
  useEffect(() => {
    mixpanel.track("Create page view");
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (
        state.status === "mediaUpload" ||
        state.status === "nftJSONUpload" ||
        state.status === "minting" ||
        state.status === "mintingSuccess"
      ) {
        return;
      }

      e.preventDefault();

      if (Platform.OS !== "web") {
        Alert.alert(
          "Did you want to delete your photo?",
          "",
          [
            {
              text: "Continue Posting",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Delete",
              onPress: () => navigation.dispatch(e.data.action),
              style: "destructive",
            },
          ],
          { cancelable: false }
        );
      }
    });
    return unsubscribe;
  }, [navigation, router]);
  //#endregion

  if (!form) {
    return null;
  }

  return (
    <ModalComponent
      title="Add details"
      close={router.pop}
      snapPoints={snapPoints}
      height="h-[90vh]"
      bodyTW="bg-white dark:bg-black"
      bodyContentTW="p-0"
    >
      <Create />
    </ModalComponent>
  );
};

export const CreateScreen = withModalScreen(CreateModal, "/create", "create");
