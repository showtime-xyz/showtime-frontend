import { Meta } from "@storybook/react";

import { Button } from "../button";
import { ToastProvider, useToast } from "../toast";
import { View } from "../view";
import { AlertProvider, useAlert } from "./index";

export default {
  component: AlertProvider,
  title: "Components/Alert",
} as Meta;
const Alert = () => {
  const Alert = useAlert();
  const toast = useToast();
  return (
    <View tw="flex-1 items-center justify-center">
      <Button tw="mb-4" onPress={() => Alert.alert("Alert label")}>
        Alert Title
      </Button>
      <Button
        tw="mb-4"
        onPress={() => Alert.alert("Alert label", "Some copy goes here...")}
      >
        Alert Message
      </Button>
      <Button
        tw="mb-4"
        onPress={() =>
          Alert.alert("Alert", "Do you know?", [
            {
              text: "I know",
              onPress: () => {
                toast?.show({ message: "I know", hideAfter: 1000 });
              },
            },
          ])
        }
      >
        Alert 1-Button
      </Button>
      <Button
        tw="mb-4"
        onPress={() =>
          Alert.alert("Alert label", "Some copy goes here...", [
            {
              text: "Cancel",
              onPress: () => {
                toast?.show({ message: "Cancel", hideAfter: 1000 });
              },
              style: "cancel",
            },
            {
              text: "Confirm",
              onPress: () => {
                toast?.show({ message: "Confirm", hideAfter: 1000 });
              },
            },
          ])
        }
      >
        Alert 2-Button
      </Button>

      <Button
        tw="mb-4"
        onPress={() =>
          Alert.alert("Options", "what you want?", [
            {
              text: "Share",
              onPress: (text) => {
                toast?.show({ message: text, hideAfter: 1000 });
              },
              style: "cancel",
            },
            {
              text: "Details",
              onPress: (text) => {
                toast?.show({ message: text, hideAfter: 1000 });
              },
            },
            {
              text: "Delete",
              onPress: (text) => {
                toast?.show({ message: text, hideAfter: 1000 });
              },
              style: "destructive",
            },
          ])
        }
      >
        Alert 3-Button
      </Button>
    </View>
  );
};
export const Basic: React.VFC<{}> = () => (
  <ToastProvider>
    <AlertProvider>
      <Alert />
    </AlertProvider>
  </ToastProvider>
);
