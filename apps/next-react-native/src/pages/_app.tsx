import "raf/polyfill";

import { useEffect, useState } from "react";
import { Platform, useColorScheme as useDeviceColorScheme } from "react-native";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react";
import { AppProps } from "next/app";
import Head from "next/head";
// Todo: move to inner-components.
import "photoswipe/dist/photoswipe.css";
import type { Revalidator, RevalidatorOptions } from "swr";
// import Script from "next/script";
import { SWRConfig } from "swr";
import type { PublicConfiguration } from "swr/dist/types";
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
import { Sentry } from "app/lib/sentry";
import { isUndefined } from "app/lib/swr/helper";
import { NavigationProvider } from "app/navigation";
import { AuthProvider } from "app/providers/auth-provider";
import { FeedProvider } from "app/providers/feed-provider";
import { MintProvider } from "app/providers/mint-provider";
import { UserProvider } from "app/providers/user-provider";
import { Web3Provider } from "app/providers/web3-provider";
import { ActivitiesScreen } from "app/screens/activities";
import { BuyScreen } from "app/screens/buy";
import { CommentsScreen } from "app/screens/comments";
import { CreateScreen } from "app/screens/create";
import { DeleteScreen } from "app/screens/delete";
import { DetailsScreen } from "app/screens/details";
import { EditProfileScreen } from "app/screens/edit-profile";
import { ListScreen } from "app/screens/list";
import { LoginScreen } from "app/screens/login";
import { TransferScreen } from "app/screens/transfer";
import { UnlistScreen } from "app/screens/unlist";

import { AlertProvider } from "design-system/alert";
import { SnackbarProvider } from "design-system/snackbar";
import { tw } from "design-system/tailwind";
import { ToastProvider, useToast } from "design-system/toast";
import { View } from "design-system/view";

import "../styles/styles.css";

// enableFreeze(true)

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
});

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
    // change browser's default color scheme
    document.documentElement.setAttribute(
      "data-color-scheme",
      isDark ? "dark" : "light"
    );
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
      <SafeAreaProvider>
        <ToastProvider>
          <AlertProvider>
            <SnackbarProvider>
              <SWRProvider>
                <Web3Provider>
                  <AppContext.Provider value={injectedGlobalContext}>
                    <AuthProvider>
                      <UserProvider>
                        <CSROnly>
                          <BottomSheetModalProvider>
                            <GrowthBookProvider growthbook={growthbook}>
                              <FeedProvider>
                                <NavigationProvider>
                                  <MintProvider>
                                    <View tw="bg-gray-100 dark:bg-black">
                                      <Header
                                        canGoBack={
                                          router.pathname === "/search" ||
                                          router.pathname.split("/").length -
                                            1 >=
                                            2
                                        }
                                      />

                                      <View tw="min-h-screen items-center">
                                        <Component {...pageProps} />
                                      </View>

                                      <Footer />
                                    </View>

                                    {/* Modals */}
                                    <CommentsScreen />
                                    <TransferScreen />
                                    <CreateScreen />
                                    <DeleteScreen />
                                    <ListScreen />
                                    <UnlistScreen />
                                    <DetailsScreen />
                                    <BuyScreen />
                                    <ActivitiesScreen />
                                    <EditProfileScreen />
                                    {/* Login should be the last so
                                      it renders on top of others if needed */}
                                    <LoginScreen />
                                  </MintProvider>
                                </NavigationProvider>
                              </FeedProvider>
                            </GrowthBookProvider>
                          </BottomSheetModalProvider>
                        </CSROnly>
                      </UserProvider>
                    </AuthProvider>
                  </AppContext.Provider>
                </Web3Provider>
              </SWRProvider>
            </SnackbarProvider>
          </AlertProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </>
  );
}

// TODO: remove CSR after replacing to css tailwind
const CSROnly = ({ children }: any) => {
  const [ready, setReady] = useState(() => {
    if (Platform.OS !== "web") {
      return true;
    }
    return false;
  });

  useEffect(() => {
    setReady(true);
  }, []);

  if (ready) return children;

  return null;
};
