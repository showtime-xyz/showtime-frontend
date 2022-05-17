import { LogBox } from "react-native";

import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";

import { MintSnackbar } from "app/components/mint-snackbar";
import { useAnalyticTools } from "app/hooks/use-analytic-tools";
import { Sentry } from "app/lib/sentry";
import { RootStackNavigator } from "app/navigation/root-stack-navigator";
import { AppProvider } from "app/providers";

enableScreens(true);

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

function App() {
  useAnalyticTools();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <StatusBar style="auto" />
        <RootStackNavigator />
        <MintSnackbar />
      </AppProvider>
    </GestureHandlerRootView>
  );
}

export default App;
