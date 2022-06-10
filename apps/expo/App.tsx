import { useEffect, useState } from "react";
import {
  LogBox,
  Platform,
  useColorScheme as useDeviceColorScheme,
} from "react-native";

import LogRocket from "@logrocket/react-native";
import rudderClient from "@rudderstack/rudder-sdk-react-native";
import * as NavigationBar from "expo-navigation-bar";
import * as Notifications from "expo-notifications";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { enableScreens } from "react-native-screens";
import { useAppColorScheme, useDeviceContext } from "twrnc";

import { tw } from "@showtime-xyz/universal.tailwind";

import { AppContext } from "app/context/app-context";
import {
  setColorScheme as setUserColorScheme,
  useColorScheme as useUserColorScheme,
} from "app/lib/color-scheme";
import { growthbook } from "app/lib/growthbook";
import { rudderConfig } from "app/lib/rudderstack/config";
import { Sentry } from "app/lib/sentry";
import { RootStackNavigator } from "app/navigation/root-stack-navigator";
import { AppProviders } from "app/providers/app-providers";

enableScreens(true);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
});

LogBox.ignoreLogs([
  "Constants.deviceYearClass",
  "No native splash screen",
  "The provided value 'ms-stream' is not a valid 'responseType'.",
  "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property.",
  "ExponentGLView",
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components",
]);

function App() {
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

  return (
    <ThemeProvider>
      <AppProviders>
        <StatusBar style="auto" />
        <RootStackNavigator />
      </AppProviders>
    </ThemeProvider>
  );
}

export default App;

function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [notification, setNotification] = useState(null);
  useDeviceContext(tw, { withDeviceColorScheme: false });
  const deviceColorScheme = useDeviceColorScheme();
  const userColorScheme = useUserColorScheme();
  const [colorScheme, , setColorScheme] = useAppColorScheme(
    tw,
    userColorScheme ?? deviceColorScheme
  );

  useState(() => setColorScheme(colorScheme));
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (isDark) {
      if (Platform.OS === "android") {
        NavigationBar.setBackgroundColorAsync("#000");
        NavigationBar.setButtonStyleAsync("light");
      }

      tw.setColorScheme("dark");
      SystemUI.setBackgroundColorAsync("black");
      setStatusBarStyle("light");
    } else {
      if (Platform.OS === "android") {
        NavigationBar.setBackgroundColorAsync("#FFF");
        NavigationBar.setButtonStyleAsync("dark");
      }

      tw.setColorScheme("light");
      SystemUI.setBackgroundColorAsync("white");
      setStatusBarStyle("dark");
    }
  }, [isDark]);

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

  const injectedGlobalContext = {
    colorScheme,
    setColorScheme: (newColorScheme: "light" | "dark") => {
      setColorScheme(newColorScheme);
      setUserColorScheme(newColorScheme);
    },
    // TODO: notification?
  };

  return (
    <AppContext.Provider value={injectedGlobalContext}>
      {children}
    </AppContext.Provider>
  );
}
