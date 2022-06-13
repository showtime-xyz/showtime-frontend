import { useContext, useEffect } from "react";
import { Platform } from "react-native";

import { useAlert } from "@showtime-xyz/universal.alert";
import { withModalScreen } from "@showtime-xyz/universal.modal-screen";
import { Spinner } from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Create } from "app/components/create";
import { PolygonScanButton } from "app/components/polygon-scan-button";
import { MintContext } from "app/context/mint-context";
import { useTrackPageViewed } from "app/lib/analytics";
import { useNavigation } from "app/lib/react-navigation/native";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { useRouter } from "app/navigation/use-router";

import { Hidden } from "design-system/hidden";

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
  }, [dispatch]);

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
  }, [Alert, navigation, router, state.status]);
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
    <View tw="flex-1">
      {state.status === "transactionInitiated" ? (
        <View tw="items-center justify-center">
          <Spinner />
          <View tw="h-10" />
          <Text tw="text-center text-black dark:text-white">
            Your NFT is being minted on Polygon network. Feel free to navigate
            away from this screen.
          </Text>
          <View tw="h-4" />
          <PolygonScanButton transactionHash={state.transaction} />
        </View>
      ) : state.status === "mintingSuccess" ? (
        <View tw="items-center justify-center">
          <Text tw="text-6xl">🎉</Text>
          <View>
            <Text tw="font-space-bold my-6 text-center text-lg text-black dark:text-white">
              Your NFT has been minted on Showtime!
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

export const CreateScreen = withModalScreen(CreateModal, {
  title: "Create",
  matchingPathname: "/create",
  matchingQueryParam: "createModal",
  disableBackdropPress: true,
});
