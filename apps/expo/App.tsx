import { useEffect, useState } from "react";
import { AppState, LogBox } from "react-native";

import { configure as configureWalletMobileSDK } from "@coinbase/wallet-mobile-sdk";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { Image } from "expo-image";
import * as Notifications from "expo-notifications";
import { AvoidSoftInput } from "react-native-avoid-softinput";
import { enableFreeze, enableScreens } from "react-native-screens";

import { useExpoUpdate } from "app/hooks/use-expo-update";
import { growthbook } from "app/lib/growthbook";
import { Logger } from "app/lib/logger";
import { Sentry } from "app/lib/sentry";
import { RootStackNavigator } from "app/navigation/root-stack-navigator";
import { AppProviders } from "app/providers/app-providers";

enableScreens(true);
enableFreeze(true);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
  enableInExpoDevelopment: false,
});

const coinbaseRedirectScheme = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/wsegue`;

configureWalletMobileSDK({
  callbackURL: new URL(coinbaseRedirectScheme),
  hostURL: new URL("https://go.cb-w.com/wsegue"),
  hostPackageName: "org.toshi",
});

Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  interruptionModeIOS: InterruptionModeIOS.DoNotMix,
  interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
}).catch(() => {});

LogBox.ignoreLogs([
  "Constants.deviceYearClass",
  "No native splash screen",
  "The provided value 'ms-stream' is not a valid 'responseType'.",
  "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property.",
  "ExponentGLView",
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components",
  "Sending `onAnimatedValueUpdate` with no listeners registered.", // `react-native-tab-view` waring issue.
  "Did not receive response to shouldStartLoad in time", // warning from @magic-sdk/react-native's react-native-webview dependency. https://github.com/react-native-webview/react-native-webview/issues/124,
  "Looks like you're trying",
]);

function App() {
  // check for updates as early as possible
  useExpoUpdate();

  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  useEffect(() => {
    AvoidSoftInput.setEnabled(true);

    return () => {
      AvoidSoftInput.setEnabled(false);
    };
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
        console.log("notification received", JSON.stringify(notification));
        setNotification(notification);
      }
    );
    // a memory warning listener for free up FastImage Cache
    const memoryWarningSubscription = AppState.addEventListener(
      "memoryWarning",
      () => {
        async function clearFastImageMemory() {
          try {
            await Image.clearMemoryCache();
            Logger.log("did receive memory warning and cleared");
          } catch {
            // ignore
          }
        }
        clearFastImageMemory();
      }
    );
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      memoryWarningSubscription.remove();
    };
  }, []);

  // Listeners registered by this method will be called whenever a user interacts with a notification (eg. taps on it).
  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("response that was clicked", JSON.stringify(response));
        // const content =
        //   Platform.OS === "ios"
        //     ? https://github.com/showtime-xyz/showtime-frontend/tree/feat/notification-log.body?.path
        //     : response?.notification?.request?.content?.data?.path;
        // Notifications.dismissNotificationAsync(
        //   response?.notification?.request?.identifier
        // );
        // Notifications.setBadgeCountAsync(0);
      });

    return () => Notifications.removeNotificationSubscription(responseListener);
  }, []);

  return (
    <AppProviders>
      <RootStackNavigator />
    </AppProviders>
  );
}

export default App;
