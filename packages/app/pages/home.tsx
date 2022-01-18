import { Platform } from "react-native";
import dynamic from "next/dynamic";

import createStackNavigator from "app/navigation/create-stack-navigator";
import { HomeStackParams } from "app/navigation/types";
import { navigatorScreenOptions } from "app/navigation/navigator-screen-options";
import { ProfileScreen } from "../screens/profile";
import { HomeScreen } from "../screens/home";
import { CreateScreen } from "../screens/create";

const LoginScreen = dynamic<JSX.Element>(() =>
  import("app/screens/login").then((mod) => mod.LoginScreen)
);
const NftScreen = dynamic<JSX.Element>(() =>
  import("app/screens/nft").then((mod) => mod.NftScreen)
);

const HomeStack = createStackNavigator<HomeStackParams>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator
      // @ts-ignore
      screenOptions={navigatorScreenOptions}
    >
      <HomeStack.Group>
        <HomeStack.Screen
          name="home"
          component={CreateScreen}
          options={{ title: "Home", headerTitle: "Showtime" }}
        />
      </HomeStack.Group>
      <HomeStack.Group
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "ios" ? "default" : "fade",
          presentation:
            Platform.OS === "ios" ? "formSheet" : "transparentModal",
        }}
      >
        <HomeStack.Screen name="login" component={LoginScreen} />
        <HomeStack.Screen name="nft" component={NftScreen} />
      </HomeStack.Group>
      <HomeStack.Screen name="profile" component={ProfileScreen} />
    </HomeStack.Navigator>
  );
}

export default HomeNavigator;
