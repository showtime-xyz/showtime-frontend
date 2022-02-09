import { useState, useEffect } from "react";
import {
  AppState,
  LogBox,
  Platform,
  useColorScheme as useDeviceColorScheme,
} from "react-native";
import { enableScreens } from "react-native-screens";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DripsyProvider } from "dripsy";
import { useDeviceContext, useAppColorScheme } from "twrnc";
import { MMKV } from "react-native-mmkv";
import { SWRConfig } from "swr";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import LogRocket from "@logrocket/react-native";
import * as Notifications from "expo-notifications";

import { tw } from "design-system/tailwind";
import { theme } from "design-system/theme";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { UserProvider } from "app/providers/user-provider";
import { Web3Provider } from "app/providers/web3-provider";
import { WalletConnectProvider } from "app/providers/wallet-connect-provider";
import { AppContext } from "app/context/app-context";
import { ToastProvider } from "design-system/toast";
import {
  setColorScheme as setUserColorScheme,
  useColorScheme as useUserColorScheme,
} from "app/lib/color-scheme";
import { RootStackNavigator } from "app/navigation/root-stack-navigator";

enableScreens(true);
// enableFreeze(true)

// Sentry.init({
// 	dsn: 'https://a0b390d1d15543a8a85ab594eb4b0c50@o614247.ingest.sentry.io/5860034',
// 	enableInExpoDevelopment: true,
// 	debug: process.env.STAGE === 'development',
// })

LogBox.ignoreLogs([
  "Constants.deviceYearClass",
  "No native splash screen",
  "The provided value 'ms-stream' is not a valid 'responseType'.",
  "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property.",
  "ExponentGLView",
]);

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
  const navigation = useNavigation();

  return (
    <SWRConfig
      value={{
        provider: mmkvProvider,
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
        const content =
          Platform.OS === "ios"
            ? response?.notification?.request?.content?.data?.body?.path
            : response?.notification?.request?.content?.data?.path;

        console.log(content);

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

  const scheme = `io.showtime${
    process.env.STAGE === "development"
      ? ".development"
      : process.env.STAGE === "staging"
      ? ".staging"
      : ""
  }`;

  console.log("App", scheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DripsyProvider theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: "black" }}>
          <ToastProvider>
            <NavigationProvider>
              <SWRProvider>
                <WalletConnectProvider>
                  <Web3Provider>
                    <AppContextProvider>
                      <AuthProvider>
                        <UserProvider>
                          <BottomSheetModalProvider>
                            <StatusBar style="auto" />
                            <RootStackNavigator />
                          </BottomSheetModalProvider>
                        </UserProvider>
                      </AuthProvider>
                    </AppContextProvider>
                  </Web3Provider>
                </WalletConnectProvider>
              </SWRProvider>
            </NavigationProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </DripsyProvider>
    </GestureHandlerRootView>
  );
}

export default App;
