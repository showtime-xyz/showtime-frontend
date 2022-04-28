import { useContext, useEffect } from "react";
import { Linking, Platform } from "react-native";

import { Create } from "app/components/create";
import { MintContext } from "app/context/mint-context";
import { useNavigation } from "app/lib/react-navigation/native";
import { useHideHeader } from "app/navigation/use-navigation-elements";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";

import { Button, Spinner, Text, View } from "design-system";
import { useAlert } from "design-system/alert";
import { Hidden } from "design-system/hidden";
import { withModalScreen } from "design-system/modal-screen/with-modal-screen";

type Query = {
  form: string;
};

const { useParam } = createParam<Query>();
const CreateModal = () => {
  useHideHeader();
  //#region hooks
  const Alert = useAlert();
  const router = useRouter();
  const navigation = useNavigation();
  const [form] = useParam("form");
  const { state, dispatch } = useContext(MintContext);
  //#endregion

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

  // if (!form) {
  //   return null;
  // }

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
      {state.status === "transactionCompleted" ? (
        <View tw="items-center justify-center">
          <Spinner />
          <Text tw="mt-10 text-center text-black dark:text-white">
            Your NFT is being minted on Polygon network. Feel free to navigate
            away from this screen.
          </Text>
        </View>
      ) : state.status === "mintingSuccess" ? (
        <View tw="items-center justify-center">
          <Text tw="mb-4 text-center text-black dark:text-white">
            🎉 Your NFT has been minted!
          </Text>
          <Button
            onPress={() => {
              Linking.openURL(
                `https://${
                  process.env.NEXT_PUBLIC_CHAIN_ID === "mumbai" ? "mumbai." : ""
                }polygonscan.com/tx/${state.transaction}`
              );
            }}
          >
            Polygon Scan
          </Button>
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
