import createStackNavigator from "app/navigation/create-stack-navigator";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { CameraStackParams } from "app/navigation/types";
import { CameraScreen } from "app/screens/camera";

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
