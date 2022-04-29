import { useEffect, useState } from "react";
import {
  AppState,
  LogBox,
  Platform,
  useColorScheme as useDeviceColorScheme,
} from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import LogRocket from "@logrocket/react-native";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import rudderClient, {
  RUDDER_LOG_LEVEL,
} from "@rudderstack/rudder-sdk-react-native";
import { DripsyProvider } from "dripsy";
import * as NavigationBar from "expo-navigation-bar";
import * as Notifications from "expo-notifications";
import { setStatusBarStyle, StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MMKV } from "react-native-mmkv";
import { enableScreens } from "react-native-screens";
import type { Revalidator, RevalidatorOptions } from "swr";
import { SWRConfig } from "swr";
import type { PublicConfiguration } from "swr/dist/types";
import { useAppColorScheme, useDeviceContext } from "twrnc";

import { MintSnackbar } from "app/components/mint-snackbar";
import { AppContext } from "app/context/app-context";
import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { track } from "app/lib/analytics";
import {
  setColorScheme as setUserColorScheme,
  useColorScheme as useUserColorScheme,
} from "app/lib/color-scheme";
import { SafeAreaProvider } from "app/lib/safe-area";
import { Sentry } from "app/lib/sentry";
import { isUndefined } from "app/lib/swr/helper";
import { NavigationProvider } from "app/navigation";
import { RootStackNavigator } from "app/navigation/root-stack-navigator";
import { AuthProvider } from "app/providers/auth-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MintProvider } from "app/providers/mint-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletConnectProvider } from "app/providers/wallet-connect-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { SnackbarProvider } from "design-system/snackbar";
import { tw } from "design-system/tailwind";
import { theme } from "design-system/theme";
import { ToastProvider, useToast } from "design-system/toast";

enableScreens(true);
// enableFreeze(true)

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

const rudderConfig = {
  dataPlaneUrl: "https://tryshowtimjtc.dataplane.rudderstack.com",
  trackAppLifecycleEvents: true,
  logLevel: RUDDER_LOG_LEVEL.INFO, // DEBUG
};

// Create a GrowthBook instance
const growthbook = new GrowthBook({
  trackingCallback: (experiment, result) => {
    track("Experiment Viewed", {
      experiment_id: experiment.key,
      variant_id: result.variationId,
    });
  },
});

function mmkvProvider() {
  const storage = new MMKV();
  const appCache = storage.getString("app-cache");
  const map = new Map(appCache ? JSON.parse(appCache) : []);

  AppState.addEventListener("change", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    storage.set("app-cache", appCache);
  });

  return map;
}

function SWRProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const toast = useToast();
  const navigation = useNavigation();
  const { refreshTokens } = useAccessTokenManager();

  return (
    <SWRConfig
      value={{
        provider: mmkvProvider,
        onError: (err, key) => {
          if (err?.message) {
            toast?.show({
              message: err.message,
              hideAfter: 4000,
            });
          }
        },
        onErrorRetry: async (
          error: {
            status: number;
          },
          key: string,
          config: Readonly<PublicConfiguration>,
          revalidate: Revalidator,
          opts: Required<RevalidatorOptions>
        ) => {
          const maxRetryCount = config.errorRetryCount;
          const currentRetryCount = opts.retryCount;

          // Exponential backoff
          const timeout =
            ~~(
              (Math.random() + 0.5) *
              (1 << (currentRetryCount < 8 ? currentRetryCount : 8))
            ) * config.errorRetryInterval;

          if (
            !isUndefined(maxRetryCount) &&
            currentRetryCount > maxRetryCount
          ) {
            return;
          }

          if (error.status === 404) {
            return;
          }

          if (error.status === 401) {
            await refreshTokens();
          }

          setTimeout(revalidate, timeout, opts);
        },
        isVisible: () => {
          return AppState.currentState === "active";
        },
        isOnline: () => {
          return true;

          // return NetInfo.fetch().then((state) => state.isConnected)
        },
        // TODO: tab focus too
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState) => {
            /* If it's resuming from background or inactive mode to active one */
            if (
              appState.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              callback();
            }
            appState = nextAppState;
          };

          // Subscribe to the app state change events
          const listener = AppState.addEventListener(
            "change",
            onAppStateChange
          );

          // Subscribe to the navigation events
          const unsubscribe = navigation.addListener("focus", callback);

          return () => {
            if (listener) {
              listener.remove();
            }
            unsubscribe();
          };
        },
        initReconnect(callback) {
          let netInfoState = {
            isConnected: undefined,
            isInternetReachable: undefined,
          };

          NetInfo.fetch().then((state) => {
            netInfoState = state;
          });

          // Subscribe to the network change events
          const unsubscribe = NetInfo.addEventListener((nextNetInfoState) => {
            if (
              netInfoState.isInternetReachable === false &&
              nextNetInfoState.isConnected === true &&
              nextNetInfoState.isInternetReachable === true
            ) {
              callback();
            }
            netInfoState = nextNetInfoState;
          });

          return () => {
            unsubscribe();
          };
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}

function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [notification, setNotification] = useState(null);
  useDeviceContext(tw, { withDeviceColorScheme: false });
  // Default to device color scheme
  const deviceColorScheme = useDeviceColorScheme();
  // User can override color scheme
  const userColorScheme = useUserColorScheme();
  // Use the user color scheme if it's set
  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(
    tw,
    userColorScheme ?? deviceColorScheme
  );

  // setting it before useEffect or else we'll see a flash of white paint before
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

    // growthbook.setAttributes({
    //   "id": "foo",
    // })
  }, []);

  const scheme = `io.showtime${
    process.env.STAGE === "development"
      ? ".development"
      : process.env.STAGE === "staging"
      ? ".staging"
      : ""
  }`;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DripsyProvider theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: "black" }}>
          <ToastProvider>
            <SnackbarProvider>
              <NavigationProvider>
                <SWRProvider>
                  <WalletConnectProvider>
                    <Web3Provider>
                      <AppContextProvider>
                        <AuthProvider>
                          <UserProvider>
                            <MintProvider>
                              <BottomSheetModalProvider>
                                <GrowthBookProvider growthbook={growthbook}>
                                  <FeedProvider>
                                    <StatusBar style="auto" />
                                    <RootStackNavigator />
                                    <MintSnackbar />
                                  </FeedProvider>
                                </GrowthBookProvider>
                              </BottomSheetModalProvider>
                            </MintProvider>
                          </UserProvider>
                        </AuthProvider>
                      </AppContextProvider>
                    </Web3Provider>
                  </WalletConnectProvider>
                </SWRProvider>
              </NavigationProvider>
            </SnackbarProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </DripsyProvider>
    </GestureHandlerRootView>
  );
}

export default App;
