import { useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

import { MintContext } from "app/context/mint-context";
import { useUser } from "app/hooks/use-user";
import { useSafeAreaInsets } from "app/lib/safe-area";
import { useRouter } from "app/navigation/use-router";

import { SnackbarState } from "design-system/snackbar";
import { initSnakbarParams, Snackbar } from "design-system/snackbar/snackbar";

import { useCurrentUserAddress } from "../hooks/use-current-user-address";

const MintSnackbar = () => {
  const insets = useSafeAreaInsets();
  const { state } = useContext(MintContext);
  const router = useRouter();
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    snackbar: initSnakbarParams,
  });

  const bottom = Platform.OS === "web" ? insets.bottom : insets.bottom + 64;
  useEffect(() => {
    if (
      state.status === "mediaUpload" ||
      state.status === "nftJSONUpload" ||
      state.status === "minting"
    ) {
      setSnackbar({
        show: true,
        snackbar: {
          text: "Creating… This may take a few minutes.",
          iconStatus: "waiting",
          bottom,
        },
      });
    }

    if (state.status === "mintingSuccess") {
      setSnackbar({
        show: true,
        snackbar: {
          text: "Created! Your NFT will appear in a minute!",
          iconStatus: "done",
          bottom,
          hideAfter: 4000,
          action: {
            text: "View",
            onPress: () => {
              setSnackbar({
                ...snackbar,
                show: false,
              });
              router.push(
                Platform.OS === "web"
                  ? `/@${user?.data?.profile?.username ?? userAddress}`
                  : `/profile`
              );
            },
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const hide = useCallback(() => {
    setSnackbar({
      show: false,
      snackbar: initSnakbarParams,
    });
  }, []);

  return <Snackbar {...snackbar} hide={hide} />;
};

export { MintSnackbar };
