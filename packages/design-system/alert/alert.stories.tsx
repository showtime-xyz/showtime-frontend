import { Platform } from "react-native";

import { Meta } from "@storybook/react";

import { Button } from "@showtime-xyz/universal.button";
import { View } from "@showtime-xyz/universal.view";

import { AlertProvider, useCustomAlert, Alert } from "./index";

export default {
  component: AlertProvider,
  title: "Components/Alert",
} as Meta;

export const Basic: React.FC<{}> = () => {
  const customAlert = useCustomAlert();

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
          Alert.alert("Alert", "Some copy goes here...", [
            {
              text: "OK",
              onPress: () => {
                console.log("OK");
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
                console.log("Cancel");
              },
              style: "cancel",
            },
            {
              text: "Confirm",
              onPress: () => {
                console.log("Confirm");
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
                console.log(text);
              },
              style: "cancel",
            },
            {
              text: "Details",
              onPress: (text) => {
                console.log(text);
              },
            },
            {
              text: "Delete",
              onPress: (text) => {
                console.log(text);
              },
              style: "destructive",
            },
          ])
        }
      >
        Alert 3-Button
      </Button>

      {/* Custom Alert */}
      {Platform.OS !== "web" && (
        <Button
          tw="mb-4"
          onPress={() =>
            customAlert.alert("Alert label", "Some copy goes here...", [
              {
                text: "Cancel",
                onPress: () => {
                  console.log("Cancel");
                },
                style: "cancel",
              },
              {
                text: "Confirm",
                onPress: () => {
                  console.log("Confirm");
                },
              },
            ])
          }
        >
          Custom Alert
        </Button>
      )}
    </View>
  );
};
