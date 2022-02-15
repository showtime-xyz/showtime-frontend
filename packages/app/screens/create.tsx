import { useEffect, useMemo } from "react";
import { Alert, Platform } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Create } from "app/components/create";
import { useMintNFT } from "app/hooks/use-mint-nft";
import { mixpanel } from "app/lib/mixpanel";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";

import { Modal, ModalSheet } from "design-system";

type Query = {
  uri: string;
};

const { useParam } = createParam<Query>();

const CreateScreen = () => {
  useHideHeader();
  //#region hooks
  const router = useRouter();
  const navigation = useNavigation();
  const [uri] = useParam("uri");

  const { startMinting, state } = useMintNFT();
  //#endregion

  //#region variables
  const snapPoints = useMemo(() => ["90%"], []);
  const CreateModal = Platform.OS === "android" ? ModalSheet : Modal;
  //#endregion

  //#region effects
  useEffect(() => {
    mixpanel.track("Create page view");
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (state.status === "mintingSuccess") {
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

  if (!uri) {
    return null;
  }

  return (
    <CreateModal
      title="Create"
      close={router.pop}
      snapPoints={snapPoints}
      height="h-[90vh]"
    >
      <Create uri={uri} state={state} startMinting={startMinting} />
    </CreateModal>
  );
};

export { CreateScreen };
