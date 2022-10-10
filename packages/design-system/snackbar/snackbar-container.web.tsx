import { View } from "react-native";

import * as Portal from "@radix-ui/react-portal";
import { AnimatePresence } from "moti";

import { Snackbar, SnackbarProps } from "./snackbar";

export const SnackbarContainer = ({
  show,
  snackbar,
  ...rest
}: SnackbarProps) => {
  return (
    <AnimatePresence>
      {show && (
        <Portal.Root>
          <View
            style={[
              {
                position: "fixed" as any,
                left: 0,
                right: 0,
                bottom: snackbar.bottom,
              },
            ]}
            pointerEvents="box-none"
          >
            <Snackbar show={show} snackbar={snackbar} {...rest} />
          </View>
        </Portal.Root>
      )}
    </AnimatePresence>
  );
};
