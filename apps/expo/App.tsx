import { useEffect } from "react";
import { AppState, LogBox } from "react-native";

import { configure as configureWalletMobileSDK } from "@coinbase/wallet-mobile-sdk";
import * as SentryReact from "@sentry/react";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { AvoidSoftInput } from "react-native-avoid-softinput";
import { enableFreeze, enableScreens } from "react-native-screens";

import { View } from "@showtime-xyz/universal.view";

import { useExpoUpdate } from "app/hooks/use-expo-update";
import { Logger } from "app/lib/logger";
import { Sentry } from "app/lib/sentry";
import { RootStackNavigator } from "app/navigation/root-stack-navigator";
import { AppProviders } from "app/providers/app-providers";

enableScreens(true);
enableFreeze(true);

SplashScreen.preventAutoHideAsync().catch(() => {
  // in very rare cases, preventAutoHideAsync can reject, this is a best effort
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.STAGE,
  enableInExpoDevelopment: false,
});

const coinbaseRedirectScheme = `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/wsegue`;

configureWalletMobileSDK({
  callbackURL: new URL(coinbaseRedirectScheme),
  hostURL: new URL("https://go.cb-w.com/wsegue"),
  hostPackageName: "org.toshi",
});

Audio.setAudioModeAsync({
  playsInSilentModeIOS: true,
  interruptionModeIOS: InterruptionModeIOS.DoNotMix,
  interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
}).catch(() => {});

LogBox.ignoreLogs([
  "Constants.deviceYearClass",
  "No native splash screen",
  "The provided value 'ms-stream' is not a valid 'responseType'.",
  "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property.",
  "ExponentGLView",
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components",
  "Sending `onAnimatedValueUpdate` with no listeners registered.", // `react-native-tab-view` waring issue.
  "Did not receive response to shouldStartLoad in time", // warning from @magic-sdk/react-native's react-native-webview dependency. https://github.com/react-native-webview/react-native-webview/issues/124,
  "Looks like you're trying",
]);

function App() {
  // check for updates as early as possible
  useExpoUpdate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const scheduleGC = () => {
      timeoutId = setInterval(() => {
        setImmediate(() => {
          globalThis?.gc?.();
        });
      }, 60_000);
    };

    scheduleGC();

    return () => {
      clearInterval(timeoutId);
    };
  }, []);

  // Handle push notifications
  useEffect(() => {
    // a memory warning listener for free up FastImage Cache
    const memoryWarningSubscription = AppState.addEventListener(
      "memoryWarning",
      () => {
        async function clearFastImageMemory() {
          try {
            await Image.clearMemoryCache();
            Logger.log("did receive memory warning and cleared");
          } catch {
            // ignore
          }
        }
        clearFastImageMemory();
      }
    );
    return () => {
      memoryWarningSubscription.remove();
    };
  }, []);

  useEffect(() => {
    AvoidSoftInput.setEnabled(true);

    return () => {
      AvoidSoftInput.setEnabled(false);
    };
  }, []);

  /*
  useEffect(() => {
    // Load feature definitions from API
    fetch(process.env.GROWTHBOOK_FEATURES_ENDPOINT)
      .then((res) => res.json())
      .then((json) => {
        growthbook.setFeatures(json.features);
      });
  }, []);
  */

  return (
    <SentryReact.ErrorBoundary
      fallback={({ error, componentStack }) => (
        <>
          <View>You have encountered an error</View>
          <View>{error.toString()}</View>
          <View>{componentStack}</View>
        </>
      )}
    >
      <AppProviders>
        <RootStackNavigator />
      </AppProviders>
    </SentryReact.ErrorBoundary>
  );
}

export default App;
