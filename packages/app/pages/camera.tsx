import { Platform } from "react-native";
import dynamic from "next/dynamic";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { CameraScreen } from "app/screens/camera";
import { CameraStackParams } from "app/navigation/types";
import { screenOptions } from "app/navigation/navigator-screen-options";

const LoginScreen = dynamic<JSX.Element>(() =>
  import("app/screens/login").then((mod) => mod.LoginScreen)
);
const NftScreen = dynamic<JSX.Element>(() =>
  import("app/screens/nft").then((mod) => mod.NftScreen)
);
const CreateScreen = dynamic<JSX.Element>(() =>
  import("app/screens/create").then((mod) => mod.CreateScreen)
);

const CameraStack = createStackNavigator<CameraStackParams>();

function CameraNavigator() {
  return (
    <CameraStack.Navigator
      // @ts-ignore
      screenOptions={screenOptions}
    >
      <CameraStack.Group>
        <CameraStack.Screen
          name="camera"
          component={CameraScreen}
          options={{ headerShown: false }}
        />
      </CameraStack.Group>
    </CameraStack.Navigator>
  );
}

export default CameraNavigator;
