import { useContext, useEffect } from "react";
import { Platform } from "react-native";

import { Create } from "app/components/create";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { MintContext } from "app/context/mint-context";
import { useTrackPageViewed } from "app/lib/analytics";
import { useNavigation } from "app/lib/react-navigation/native";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { useRouter } from "app/navigation/use-router";

import { Spinner, Text, View } from "design-system";
import { useAlert } from "design-system/alert";
import { Hidden } from "design-system/hidden";
import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

const CreateModal = () => {
  //#region hooks
  useTrackPageViewed({ name: "Create" });
  useHideHeader();
  const Alert = useAlert();
  const router = useRouter();
  const navigation = useNavigation();
  const { state, dispatch } = useContext(MintContext);
  //#endregion

  useEffect(() => {
    return () => {
      if (Platform.OS === "web") {
        dispatch({ type: "reset" });
      }
    };
  }, []);

  //#region effects
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

  return (
    <>
      <Hidden until="md">
        <CreateMD />
      </Hidden>

      <Hidden from="md">
        <Create />
      </Hidden>
    </>
  );
};

const CreateMD = () => {
  const { state } = useContext(MintContext);
  return (
    <View tw="flex-1 py-8">
      {state.status === "transactionInitiated" ? (
        <View tw="items-center justify-center">
          <Spinner />
          <Text tw="mt-10 mb-4 text-center text-black dark:text-white">
            Your NFT is being minted on Polygon network. Feel free to navigate
            away from this screen.
          </Text>
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      ) : state.status === "mintingSuccess" ? (
        <View tw="items-center justify-center">
          <Text variant="text-4xl">🎉</Text>
          <View>
            <Text
              variant="text-lg"
              tw="my-8 text-center text-black dark:text-white"
            >
              Your NFT has been listed on Showtime!
            </Text>
            <PolygonScanButton transactionHash={state.transaction} />
          </View>
        </View>
      ) : (
        <Create />
      )}
    </View>
  );
};

export const CreateScreen = withModalScreen(
  CreateModal,
  "Create",
  "/create",
  "createModal"
);
