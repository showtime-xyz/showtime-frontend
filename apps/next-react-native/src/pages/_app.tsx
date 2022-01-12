import "../styles/styles.css";

import "raf/polyfill";

import { useState, useEffect } from "react";
// import { useRouter } from 'next/router'
// import { enableFreeze } from 'react-native-screens'
import { SafeAreaProvider } from "react-native-safe-area-context";
import Head from "next/head";
import { AppProps } from "next/app";
import { DripsyProvider } from "dripsy";
import { useDeviceContext } from "twrnc";
import { SWRConfig, useSWRConfig } from "swr";

import { accessTokenManager } from "app/lib/access-token-manager";
import { tw } from "design-system/tailwind";
import { theme } from "design-system/theme";
import { NavigationProvider } from "app/navigation";
import { NextTabNavigator } from "app/navigation/next-tab-navigator";
import { isServer } from "app/lib/is-server";
import { AppContext } from "app/context/app-context";
import { setLogout } from "app/lib/logout";
import { mixpanel } from "app/lib/mixpanel";
import { deleteCache } from "app/lib/delete-cache";
import { useRouter } from "app/navigation/use-router";
import { useUser } from "app/hooks/use-user";
import { deleteRefreshToken } from "app/lib/refresh-token";

// enableFreeze(true)

function localStorageProvider() {
  const map = new Map(JSON.parse(localStorage.getItem("app-cache")) || []);

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });

  return map;
}

function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { user } = useUser();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [web3, setWeb3] = useState(null);
  const injectedGlobalContext = {
    web3,
    setWeb3,
    logOut: () => {
      deleteCache();
      deleteRefreshToken();
      accessTokenManager.deleteAccessToken();
      mutate(null);
      setWeb3(null);
      mixpanel.track("Logout");
      // Triggers all event listeners for this key to fire. Used to force cross tab logout.
      setLogout(Date.now().toString());
    },
  };

  return (
    <AppContext.Provider value={injectedGlobalContext}>
      {children}
    </AppContext.Provider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  useDeviceContext(tw);

  return (
    <>
      <Head>
        <title>Showtime</title>
        <meta key="title" name="title" content="Showtime" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
          name="viewport"
        />
      </Head>
      <DripsyProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationProvider>
            <SWRConfig
              value={{
                provider: isServer ? () => new Map() : localStorageProvider,
              }}
            >
              <AppContextProvider>
                <NextTabNavigator Component={Component} pageProps={pageProps} />
              </AppContextProvider>
            </SWRConfig>
          </NavigationProvider>
        </SafeAreaProvider>
      </DripsyProvider>
    </>
  );
}
