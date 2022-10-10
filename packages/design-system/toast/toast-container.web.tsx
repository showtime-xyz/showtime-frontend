import { View } from "react-native";

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
    <AnimatePresence>
      {show && (
        <Portal.Root>
          <View
            style={[{ position: "fixed" as any, left: 0, right: 0 }]}
            pointerEvents="none"
          >
            <Toast render={render} message={message} hide={hide} />
          </View>
        </Portal.Root>
      )}
    </AnimatePresence>
  );
};
