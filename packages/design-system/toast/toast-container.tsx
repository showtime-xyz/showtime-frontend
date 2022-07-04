import { StyleSheet, View } from "react-native";

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
        <View style={[StyleSheet.absoluteFillObject]}>
          <Toast render={render} message={message} hide={hide} />
        </View>
      )}
    </AnimatePresence>
  );
};
