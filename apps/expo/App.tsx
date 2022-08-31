import { useEffect, useState } from "react";
import { LogBox } from "react-native";

import LogRocket from "@logrocket/react-native";
import rudderClient from "@rudderstack/rudder-sdk-react-native";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { enableScreens } from "react-native-screens";

import { growthbook } from "app/lib/growthbook";
import { rudderConfig } from "app/lib/rudderstack/config";
import { Sentry } from "app/lib/sentry";
import { RootStackNavigator } from "app/navigation/root-stack-navigator";
import { AppProviders } from "app/providers/app-providers";

enableScreens(true);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
  enableInExpoDevelopment: false,
});

LogBox.ignoreLogs([
  "Constants.deviceYearClass",
  "No native splash screen",
  "The provided value 'ms-stream' is not a valid 'responseType'.",
  "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property.",
  "ExponentGLView",
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components",
  "Sending `onAnimatedValueUpdate` with no listeners registered.", // `react-native-tab-view` waring issue.
  "Did not receive response to shouldStartLoad in time", // warning from @magic-sdk/react-native's react-native-webview dependency. https://github.com/react-native-webview/react-native-webview/issues/124
]);

function App() {
  const [notification, setNotification] = useState(null);
  useEffect(() => {
    if (process.env.STAGE !== "development") {
      LogRocket.init("oulg1q/showtime", {
        redactionTags: ["data-private"],
      });
    }
  }, []);

  useEffect(() => {
    const initAnalytics = async () => {
      await rudderClient.setup(
        process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY,
        rudderConfig
      );
    };

    initAnalytics();
  }, []);

  useEffect(() => {
    // Load feature definitions from API
    fetch(process.env.GROWTHBOOK_FEATURES_ENDPOINT)
      .then((res) => res.json())
      .then((json) => {
        growthbook.setFeatures(json.features);
      });
  }, []);

  useEffect(() => {
    let shouldShowNotification = true;
    if (notification) {
      // TODO:
      // const content = notification?.request?.content?.data?.body?.path;
      // const currentScreen = '';
      // const destinationScreen = '';
      // Don't show if already on the same screen as the destination screen
      // shouldShowNotification = currentScreen !== destinationScreen;
    }

    // priority: AndroidNotificationPriority.HIGH,
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: shouldShowNotification,
        shouldPlaySound: shouldShowNotification,
        shouldSetBadge: false, // shouldShowNotification
      }),
    });
  }, [notification]);

  // Handle push notifications
  useEffect(() => {
    // Handle notifications that are received while the app is open.
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    return () =>
      Notifications.removeNotificationSubscription(notificationListener);
  }, []);

  // Listeners registered by this method will be called whenever a user interacts with a notification (eg. taps on it).
  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // const content =
        //   Platform.OS === "ios"
        //     ? response?.notification?.request?.content?.data?.body?.path
        //     : response?.notification?.request?.content?.data?.path;
        // Notifications.dismissNotificationAsync(
        //   response?.notification?.request?.identifier
        // );
        // Notifications.setBadgeCountAsync(0);
      });

    return () => Notifications.removeNotificationSubscription(responseListener);
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  }, []);

  return (
    <AppProviders>
      <StatusBar style="auto" />
      <RootStackNavigator />
    </AppProviders>
  );
}

export default App;
