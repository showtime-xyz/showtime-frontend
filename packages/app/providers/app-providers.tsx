import { useState, useEffect } from "react";
import { Platform, useColorScheme as useDeviceColorScheme } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import * as NavigationBar from "expo-navigation-bar";
import * as Notifications from "expo-notifications";
import { setStatusBarStyle } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppColorScheme, useDeviceContext } from "twrnc";

import { AlertProvider } from "@showtime-xyz/universal.alert";
import { SafeAreaProvider } from "@showtime-xyz/universal.safe-area";
import { SnackbarProvider } from "@showtime-xyz/universal.snackbar";
import { ToastProvider } from "@showtime-xyz/universal.toast";

import { AppContext } from "app/context/app-context";
import { useColorSchemeConfig } from "app/hooks/use-color-scheme";
import {
  setColorScheme as setUserColorScheme,
  useColorScheme as useUserColorScheme,
} from "app/lib/color-scheme";
import { growthbook } from "app/lib/growthbook";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MintProvider } from "app/providers/mint-provider";
import { SWRProvider } from "app/providers/swr-provider";
import { UserProvider } from "app/providers/user-provider";
import { WalletProvider } from "app/providers/wallet-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { tw } from "design-system/tailwind";

// import { LightBoxProvider } from "@showtime-xyz/universal.light-box";

const AppContextProvider = ({ children }) => {
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

  // const injectedGlobalContext = {
  //   colorScheme,
  //   setColorScheme: (newColorScheme: "light" | "dark") => {
  //     setColorScheme(newColorScheme);
  //     setUserColorScheme(newColorScheme);
  //   },
  // };

  return (
    <AppContext.Provider
      value={{
        colorScheme,
        setColorScheme: (newColorScheme: "light" | "dark") => {
          setColorScheme(newColorScheme);
          setUserColorScheme(newColorScheme);
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useNotifications();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ backgroundColor: "black" }}>
        <WalletProvider>
          <Web3Provider>
            <ToastProvider>
              <AlertProvider>
                {/* <LightBoxProvider> */}
                <SnackbarProvider>
                  <NavigationProvider>
                    <SWRProvider>
                      <AppContextProvider>
                        <AuthProvider>
                          <UserProvider>
                            <BottomSheetModalProvider>
                              <GrowthBookProvider growthbook={growthbook}>
                                <FeedProvider>
                                  <MintProvider>{children}</MintProvider>
                                </FeedProvider>
                              </GrowthBookProvider>
                            </BottomSheetModalProvider>
                          </UserProvider>
                        </AuthProvider>
                      </AppContextProvider>
                    </SWRProvider>
                  </NavigationProvider>
                </SnackbarProvider>
                {/* </LightBoxProvider> */}
              </AlertProvider>
            </ToastProvider>
          </Web3Provider>
        </WalletProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const useNotifications = () => {
  const [notification, setNotification] = useState(null);

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
};
