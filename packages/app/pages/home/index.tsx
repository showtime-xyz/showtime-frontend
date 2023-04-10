import { createStackNavigator } from "app/navigation/create-stack-navigator";
import { HomeStackParams } from "app/navigation/types";
import { HomeScreen } from "app/screens/home";

const HomeStack = createStackNavigator<HomeStackParams>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
}

export default HomeNavigator;
