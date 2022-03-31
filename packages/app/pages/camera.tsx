import dynamic from "next/dynamic";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { CameraStackParams } from "app/navigation/types";
import { CameraScreen } from "app/screens/camera";

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
      <CameraStack.Screen
        name="camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
    </CameraStack.Navigator>
  );
}

export default CameraNavigator;
