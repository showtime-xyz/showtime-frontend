import { Platform } from "react-native";
import dynamic from "next/dynamic";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { CameraScreen } from "app/screens/camera";
import { CameraStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";

const LoginScreen = dynamic<JSX.Element>(() =>
  import("app/screens/login").then((mod) => mod.LoginScreen)
);
const NftScreen = dynamic<JSX.Element>(() =>
  import("app/screens/nft").then((mod) => mod.NftScreen)
);

const CameraStack = createStackNavigator<CameraStackParams>();

function CameraNavigator() {
  return (
    <CameraStack.Navigator
      // @ts-ignore
      screenOptions={navigatorScreenOptions}
    >
      <CameraStack.Group>
        <CameraStack.Screen
          name="camera"
          component={CameraScreen}
          options={{ title: "Camera", headerTitle: "Camera" }}
        />
      </CameraStack.Group>
      <CameraStack.Group
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "ios" ? "default" : "fade",
          presentation:
            Platform.OS === "ios" ? "formSheet" : "transparentModal",
        }}
      >
        <CameraStack.Screen name="login" component={LoginScreen} />
        <CameraStack.Screen name="nft" component={NftScreen} />
      </CameraStack.Group>
    </CameraStack.Navigator>
  );
}

export default CameraNavigator;
