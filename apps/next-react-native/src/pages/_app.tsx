import "raf/polyfill";

import { useEffect } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { DripsyProvider } from "dripsy";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { SWRConfig } from "swr";
import { useDeviceContext } from "twrnc";

import { AppContext } from "app/context/app-context";
import { track } from "app/lib/analytics";
import { isServer } from "app/lib/is-server";
// import { enableFreeze } from 'react-native-screens'
import { SafeAreaProvider } from "app/lib/safe-area";
import { AuthProvider } from "app/providers/auth-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MintProvider } from "app/providers/mint-provider";
import { UserProvider } from "app/providers/user-provider";
import { Web3Provider } from "app/providers/web3-provider";

import { tw } from "design-system/tailwind";
import { theme } from "design-system/theme";
import { ToastProvider } from "design-system/toast";

import "../styles/styles.css";

// enableFreeze(true)

// Create a GrowthBook instance
const growthbook = new GrowthBook({
  trackingCallback: (experiment, result) => {
    track("Experiment Viewed", {
      experiment_id: experiment.key,
      variant_id: result.variationId,
    });
  },
});

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

  useEffect(() => {
    // Load feature definitions from API
    // TODO: fix bug with `.json()` on web
    // fetch(process.env.NEXT_PUBLIC_GROWTHBOOK_FEATURES_ENDPOINT)
    //   .then((res) => res.json())
    //   .then((json) => {
    //     growthbook.setFeatures(json.features);
    //   });
    // growthbook.setAttributes({
    //   "id": "foo",
    // })
  }, []);

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
        <Script
          dangerouslySetInnerHTML={{ __html: renderEmptyAnalyticsSnippet() }}
        />
        <Script
          // strategy="lazyOnload"
          strategy="worker"
          dangerouslySetInnerHTML={{
            __html: renderAnalyticsSnippet(),
          }}
        />
      </Head>
      <DripsyProvider theme={theme} ssr>
        <SafeAreaProvider>
          <ToastProvider>
            <SWRConfig
              value={{
                provider: isServer ? () => new Map() : localStorageProvider,
              }}
            >
              <Web3Provider>
                <AppContextProvider>
                  <AuthProvider>
                    <UserProvider>
                      <MintProvider>
                        <BottomSheetModalProvider>
                          <GrowthBookProvider growthbook={growthbook}>
                            <FeedProvider>
                              <Component {...pageProps} />
                            </FeedProvider>
                          </GrowthBookProvider>
                        </BottomSheetModalProvider>
                      </MintProvider>
                    </UserProvider>
                  </AuthProvider>
                </AppContextProvider>
              </Web3Provider>
            </SWRConfig>
          </ToastProvider>
        </SafeAreaProvider>
      </DripsyProvider>
    </>
  );
}
