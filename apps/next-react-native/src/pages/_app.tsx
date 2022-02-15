import { Partytown } from "@builder.io/partytown/react";
import { DripsyProvider } from "dripsy";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import "raf/polyfill";
// import { enableFreeze } from 'react-native-screens'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SWRConfig } from "swr";
import { useDeviceContext } from "twrnc";

import { AppContext } from "app/context/app-context";
import { isServer } from "app/lib/is-server";
import { NavigationProvider } from "app/navigation";
import { NextTabNavigator } from "app/navigation/next-tab-navigator";
import { AuthProvider } from "app/providers/auth-provider";
import { UserProvider } from "app/providers/user-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { tw } from "design-system/tailwind";
import { theme } from "design-system/theme";
import { ToastProvider } from "design-system/toast";

import "../styles/styles.css";

// enableFreeze(true)

const RUDDERSTACK_WRITE_KEY = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
const RUDDERSTACK_DATA_PLANE_URL = `https://tryshowtimjtc.dataplane.rudderstack.com`;

function renderEmptyAnalyticsSnippet() {
  return `rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(d){return function(){rudderanalytics.push([d,...arguments])}}(method)}rudderanalytics.load("${RUDDERSTACK_WRITE_KEY}","${RUDDERSTACK_DATA_PLANE_URL}",{sendAdblockPage:!1,sendAdblockPageOptions:{integrations:{All:!1,Amplitude:!1}},logLevel:"ERROR"});`;
}

function renderAnalyticsSnippet() {
  return `!function(){var e=window.rudderanalytics=window.rudderanalytics||[];e.methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],e.factory=function(t){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(t),e.push(r),e}};for(var t=0;t<e.methods.length;t++){var r=e.methods[t];e[r]=e.factory(r)}e.loadJS=function(e,t){var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.rudderlabs.com/v1/rudder-analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a)},e.loadJS(),e.load(${RUDDERSTACK_WRITE_KEY},${RUDDERSTACK_DATA_PLANE_URL}),e.page()}();`;
}

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
  // TODO: color scheme

  const injectedGlobalContext = {};

  return (
    <AppContext.Provider value={injectedGlobalContext}>
      {children}
    </AppContext.Provider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  useDeviceContext(tw, { withDeviceColorScheme: false });

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

        {/* Analytics */}
        <script
          dangerouslySetInnerHTML={{ __html: renderEmptyAnalyticsSnippet() }}
        />
        {/* <Partytown debug={true} forward={["dataLayer.push"]} /> */}
        <Script
          // type="text/partytown"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: renderAnalyticsSnippet(),
          }}
        />
      </Head>
      <DripsyProvider theme={theme}>
        <SafeAreaProvider>
          <ToastProvider>
            <NavigationProvider>
              <SWRConfig
                value={{
                  provider: isServer ? () => new Map() : localStorageProvider,
                }}
              >
                <Web3Provider>
                  <AppContextProvider>
                    <AuthProvider>
                      <UserProvider>
                        <NextTabNavigator
                          Component={Component}
                          pageProps={pageProps}
                        />
                      </UserProvider>
                    </AuthProvider>
                  </AppContextProvider>
                </Web3Provider>
              </SWRConfig>
            </NavigationProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </DripsyProvider>
    </>
  );
}
