import "raf/polyfill";

import { useEffect, useState } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { DripsyProvider } from "dripsy";
import { AppProps } from "next/app";
import Head from "next/head";
import type { PublicConfiguration, Revalidator, RevalidatorOptions } from "swr";
// import Script from "next/script";
import { SWRConfig } from "swr";
import { useAppColorScheme, useDeviceContext } from "twrnc";

import { Footer } from "app/components/footer";
import { Header } from "app/components/header";
import { AppContext } from "app/context/app-context";
import { useAccessTokenManager } from "app/hooks/auth/use-access-token-manager";
import { track } from "app/lib/analytics";
import {
  setColorScheme as setUserColorScheme,
  useColorScheme as useUserColorScheme,
} from "app/lib/color-scheme";
import { isServer } from "app/lib/is-server";
import LogRocket from "app/lib/logrocket";
// import { enableFreeze } from 'react-native-screens'
import { SafeAreaProvider } from "app/lib/safe-area";
import { isUndefined } from "app/lib/swr/helper";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MintProvider } from "app/providers/mint-provider";
import { UserProvider } from "app/providers/user-provider";
import { Web3Provider } from "app/providers/web3-provider";
import { ActivitiesScreen } from "app/screens/activities";
import { CommentsScreen } from "app/screens/comments";
import { CreateScreen } from "app/screens/create";
import { DeleteScreen } from "app/screens/delete";
import { DetailsScreen } from "app/screens/details";
import { ListScreen } from "app/screens/list";
import { LoginScreen } from "app/screens/login";
import { TransferScreen } from "app/screens/transfer";
import { UnlistScreen } from "app/screens/unlist";

import { SnackbarProvider } from "design-system/snackbar";
import { tw } from "design-system/tailwind";
import { theme } from "design-system/theme";
import { ToastProvider, useToast } from "design-system/toast";
import { View } from "design-system/view";

import "../styles/styles.css";

// enableFreeze(true)

const RUDDERSTACK_WRITE_KEY = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
const RUDDERSTACK_DATA_PLANE_URL = `https://tryshowtimjtc.dataplane.rudderstack.com`;

function renderEmptyAnalyticsSnippet() {
  return `rudderanalytics=window.rudderanalytics=[];for(var methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],i=0;i<methods.length;i++){var method=methods[i];rudderanalytics[method]=function(a){return function(){rudderanalytics.push([a].concat(Array.prototype.slice.call(arguments)))}}(method)}rudderanalytics.load("${RUDDERSTACK_WRITE_KEY}","${RUDDERSTACK_DATA_PLANE_URL}",{sendAdblockPage:!1,sendAdblockPageOptions:{integrations:{All:!1,Amplitude:!1}},logLevel:"ERROR"}),rudderanalytics.page();`;
}

function renderAnalyticsSnippet() {
  return `!function(){var e=window.rudderanalytics=window.rudderanalytics||[];e.methods=["load","page","track","identify","alias","group","ready","reset","getAnonymousId","setAnonymousId"],e.factory=function(t){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(t),e.push(r),e}};for(var t=0;t<e.methods.length;t++){var r=e.methods[t];e[r]=e.factory(r)}e.loadJS=function(e,t){var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.rudderlabs.com/v1.1/rudder-analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a)},e.loadJS(),e.load(${RUDDERSTACK_WRITE_KEY},${RUDDERSTACK_DATA_PLANE_URL}),e.page()}();`;
}

// Create a GrowthBook instance
const growthbook = new GrowthBook({
  trackingCallback: (experiment, result) => {
    track("Experiment Viewed", {
      experiment_id: experiment.key,
      variant_id: result.variationId,
    });
  },
});

function localStorageProvider() {
  const map = new Map(JSON.parse(localStorage.getItem("app-cache")) || []);

  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem("app-cache", appCache);
  });

  return map;
}

function SWRProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const toast = useToast();
  const { refreshTokens } = useAccessTokenManager();

  return (
    <SWRConfig
      value={{
        provider: isServer ? () => new Map() : localStorageProvider,
        onError: (err, key) => {
          toast?.show({
            message: err,
            hideAfter: 4000,
          });
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
      }}
    >
      {children}
    </SWRConfig>
  );
}

export default function App({ Component, pageProps, router }: AppProps) {
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
    if (process.env.STAGE !== "development") {
      LogRocket.init("oulg1q/showtime", {
        redactionTags: ["data-private"],
      });
    }
  }, []);

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
      tw.setColorScheme("dark");
    } else {
      tw.setColorScheme("light");
    }
  }, [isDark]);

  const injectedGlobalContext = {
    colorScheme,
    setColorScheme: (newColorScheme: "light" | "dark") => {
      setColorScheme(newColorScheme);
      setUserColorScheme(newColorScheme);
    },
  };

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
        {/* <Script
          strategy="worker"
          dangerouslySetInnerHTML={{
            __html: renderAnalyticsSnippet(),
          }}
        /> */}
      </Head>
      <DripsyProvider theme={theme} ssr>
        <SafeAreaProvider>
          <ToastProvider>
            <SnackbarProvider>
              <SWRProvider>
                <Web3Provider>
                  <AppContext.Provider value={injectedGlobalContext}>
                    <AuthProvider>
                      <UserProvider>
                        <BottomSheetModalProvider>
                          <GrowthBookProvider growthbook={growthbook}>
                            <FeedProvider>
                              <NavigationProvider>
                                <MintProvider>
                                  <View tw="bg-gray-100 dark:bg-black">
                                    <Header
                                      canGoBack={
                                        router.pathname === "/search" ||
                                        router.pathname.split("/").length - 1 >=
                                          2
                                      }
                                    />

                                    <View tw="min-h-screen items-center">
                                      <Component {...pageProps} />
                                    </View>

                                    <Footer />
                                  </View>

                                  {/* Modals */}
                                  <LoginScreen />
                                  <CommentsScreen />
                                  <TransferScreen />
                                  <CreateScreen />
                                  <DeleteScreen />
                                  <ListScreen />
                                  <UnlistScreen />
                                  <DetailsScreen />
                                  <ActivitiesScreen />
                                </MintProvider>
                              </NavigationProvider>
                            </FeedProvider>
                          </GrowthBookProvider>
                        </BottomSheetModalProvider>
                      </UserProvider>
                    </AuthProvider>
                  </AppContext.Provider>
                </Web3Provider>
              </SWRProvider>
            </SnackbarProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </DripsyProvider>
    </>
  );
}
