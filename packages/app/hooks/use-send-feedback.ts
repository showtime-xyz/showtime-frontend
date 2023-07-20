import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import * as MailComposer from "expo-mail-composer";

import { Alert } from "@showtime-xyz/universal.alert";

import packageJson from "../../../package.json";

const FEEDBACK_EMAIL_ADDRESS = "help@showtime.xyz";

export function useSendFeedback() {
  const [isAvailable, setIsAvailable] = useState(false);
  useEffect(() => {
    const checkEmailSupport = async () => {
      const available = await MailComposer.isAvailableAsync();
      setIsAvailable(available);
    };
    checkEmailSupport();
  }, []);
  const onSendFeedback = useCallback(async () => {
    try {
      await MailComposer.composeAsync({
        subject: `✦ Showtime Feedback - ${Platform.select({
          ios: "iOS",
          android: "Android",
          web: "Web",
        })} ${`v${Constants?.expoConfig?.version ?? packageJson?.version}`}`,
        recipients: [FEEDBACK_EMAIL_ADDRESS],
        body: ``,
      });
    } catch (e) {
      Alert.alert(
        "Error launching email client",
        "Would you like to manually copy our feedback email address to your clipboard?",
        [
          {
            text: "Copy email address",
            onPress: async () => {
              await Clipboard.setStringAsync(FEEDBACK_EMAIL_ADDRESS);
            },
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
  }, []);

  return { onSendFeedback, isAvailable };
}
