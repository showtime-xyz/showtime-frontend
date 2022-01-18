import { useState, useEffect } from "react";
import {
  AppState,
  LogBox,
  Platform,
  useColorScheme as useDeviceColorScheme,
} from "react-native";
import {
  enableScreens,
  // enableFreeze,
  FullWindowOverlay,
} from "react-native-screens";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DripsyProvider } from "dripsy";
import { useDeviceContext, useAppColorScheme } from "twrnc";
// import * as Sentry from 'sentry-expo'
import { MMKV } from "react-native-mmkv";
import { SWRConfig, useSWRConfig } from "swr";
import WalletConnectProvider, {
  useWalletConnect,
  RenderQrcodeModalProps,
  QrcodeModal,
} from "@walletconnect/react-native-dapp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";

import { tw } from "design-system/tailwind";
import { theme } from "design-system/theme";
import { NavigationProvider } from "app/navigation";
import { NextTabNavigator } from "app/navigation/next-tab-navigator";
import { accessTokenManager } from "app/lib/access-token-manager";
import { AppContext } from "app/context/app-context";
import { setLogout } from "app/lib/logout";
import { mixpanel } from "app/lib/mixpanel";
import { deleteCache } from "app/lib/delete-cache";
import { useUser } from "app/hooks/use-user";
import { deleteRefreshToken } from "app/lib/refresh-token";
import { ToastProvider } from "design-system/toast";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  setColorScheme as setUserColorScheme,
  useColorScheme as useUserColorScheme,
} from "app/lib/color-scheme";
import * as FileSystem from "expo-file-system";

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

function QRCodeModal(props: RenderQrcodeModalProps): JSX.Element {
  if (!props.visible) {
    return null;
  }

  return (
    <FullWindowOverlay
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <QrcodeModal division={4} {...props} />
    </FullWindowOverlay>
  );
}

// FileSystem.downloadAsync(
//   "https://lh3.googleusercontent.com/eDuDBbt8CfAClm4XAfRPf63lZ0DCcf1elQai_43gcmnWr8nuwjXoAZF3xwmWnh5yt8BCA2URJzIJijSVjpUjBVCK-kMi7RZwTuSx=w660",
//   FileSystem.documentDirectory + "test.jpg"
// )
//   .then(({ uri }) => {
//     console.log("Finished downloading to ", uri);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

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
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const connector = useWalletConnect();
  const [web3, setWeb3] = useState(null);

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

  const injectedGlobalContext = {
    web3,
    setWeb3,
    logOut: () => {
      deleteCache();
      deleteRefreshToken();
      accessTokenManager.deleteAccessToken();
      mutate(null);
      connector.killSession();
      setWeb3(null);
      mixpanel.track("Logout");
      // Triggers all event listeners for this key to fire. Used to force cross tab logout.
      setLogout(Date.now().toString());
    },
    colorScheme,
    setColorScheme: (newColorScheme: "light" | "dark") => {
      setColorScheme(newColorScheme);
      setUserColorScheme(newColorScheme);
    },
  };

  return (
    <AppContext.Provider value={injectedGlobalContext}>
      {children}
    </AppContext.Provider>
  );
}

function App() {
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
            <NavigationProvider>
              <SWRProvider>
                <WalletConnectProvider
                  clientMeta={{
                    description: "Connect with Showtime",
                    url: "https://showtime.io",
                    icons: [
                      "https://storage.googleapis.com/showtime-cdn/showtime-icon-sm.jpg",
                    ],
                    name: "Showtime",
                    // @ts-expect-error
                    scheme: scheme,
                  }}
                  redirectUrl={`${scheme}://`}
                  storageOptions={{
                    // @ts-ignore
                    asyncStorage: AsyncStorage,
                  }}
                  renderQrcodeModal={(
                    props: RenderQrcodeModalProps
                  ): JSX.Element => <QRCodeModal {...props} />}
                >
                  <AppContextProvider>
                    <>
                      <StatusBar style="auto" />
                      <NextTabNavigator />
                    </>
                  </AppContextProvider>
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
