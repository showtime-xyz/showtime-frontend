import { View } from "react-native";

import { Snackbar, SnackbarProps, SNACKBAR_HEIGHT } from "./snackbar";

export const SnackbarContainer = ({
  show,
  snackbar,
  ...rest
}: SnackbarProps) => {
  return (
    <>
      {show && (
        <View
          style={{
            position: "absolute",
            height: SNACKBAR_HEIGHT,
            width: "100%",
            bottom: snackbar.bottom,
          }}
        >
          <Snackbar show={show} snackbar={snackbar} {...rest} />
        </View>
      )}
    </>
  );
};
