import { PreviewRuntime } from "@teambit/preview";
import { ReactNativeAspect } from "@teambit/react-native";

// create your theme and import it here
// import { ThemeCompositions } from '@my-company/my-scope.theme.theme-compositions';
import { ReactNativeWebAspect } from "./react-native-web.aspect";

export class ReactNativeWebPreviewMain {
  static runtime = PreviewRuntime;

  static dependencies = [ReactNativeAspect];

  static async provider() {
    const reactNativeWebPreviewMain = new ReactNativeWebPreviewMain();
    // uncomment the line below to register a new provider to wrap all compositions using this environment with a custom theme.
    // reactNative.registerProvider([ThemeCompositions]);

    return reactNativeWebPreviewMain;
  }
}

ReactNativeWebAspect.addRuntime(ReactNativeWebPreviewMain);
