import { StyleSheet, View } from "react-native";

import * as Portal from "@radix-ui/react-portal";
import { AnimatePresence } from "moti";

import { Toast } from "./toast";

type ToastProps = {
  show: boolean;
  render?: JSX.Element | null;
  message?: string;
  hide: () => void;
};

export const ToastContainer = ({ show, render, message, hide }: ToastProps) => {
  return (
    // @ts-ignore
    <AnimatePresence>
      {show && (
        <Portal.Root>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { position: "fixed" as any },
            ]}
            pointerEvents="box-none"
          >
            <Toast render={render} message={message} hide={hide} />
          </View>
        </Portal.Root>
      )}
    </AnimatePresence>
  );
};
