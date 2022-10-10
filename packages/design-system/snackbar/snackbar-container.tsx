import { View, Platform } from "react-native";

import { AnimatePresence } from "moti";
import { FullWindowOverlay } from "react-native-screens";

import { Snackbar, SnackbarProps, SNACKBAR_HEIGHT } from "./snackbar";

const OverLayView = Platform.OS === "ios" ? FullWindowOverlay : View;

export const SnackbarContainer = ({
  show,
  snackbar,
  ...rest
}: SnackbarProps) => {
  return (
    <AnimatePresence>
      {show && (
        <OverLayView
          style={{
            position: "absolute",
            height: SNACKBAR_HEIGHT,
            width: "100%",
            bottom: snackbar.bottom,
          }}
        >
          <Snackbar show={show} snackbar={snackbar} {...rest} />
        </OverLayView>
      )}
    </AnimatePresence>
  );
};
