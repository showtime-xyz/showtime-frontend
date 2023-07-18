import { useWindowDimensions } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useUser } from "app/hooks/use-user";
import CreateNavigator from "app/pages/create";
import CreatorChannelsNavigator from "app/pages/creator-channels";
import HomeNavigator from "app/pages/home";
import NotificationsNavigator from "app/pages/notifications";
import ProfileNavigator from "app/pages/profile";

import { BottomTabbar } from "./bottom-tab-bar";
import {
  CreatorChannelsTabBarIcon,
  HomeTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
} from "./tab-bar-icons";

const BottomTab = createBottomTabNavigator();

export function BottomTabNavigator() {
  const { width } = useWindowDimensions();
  const { user } = useUser();

  return (
    <BottomTab.Navigator
      initialRouteName="homeTab"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <BottomTabbar {...props} />}
    >
      <BottomTab.Screen
        name="homeTab"
        component={HomeNavigator}
        options={{
          tabBarIcon: HomeTabBarIcon,
        }}
      />
      <BottomTab.Screen
        name="channelsTab"
        component={CreatorChannelsNavigator}
        options={{
          tabBarIcon: CreatorChannelsTabBarIcon,
        }}
      />
      {width < 768 && (
        <BottomTab.Screen
          name="createTab"
          component={CreateNavigator}
          options={{
            tabBarButton: () => null,
          }}
        />
      )}
      {width < 768 && (
        <BottomTab.Screen
          name="notificationsTab"
          component={NotificationsNavigator}
          options={{
            tabBarIcon: NotificationsTabBarIcon,
          }}
        />
      )}
      {width < 768 && (
        <BottomTab.Screen
          name="profileTab"
          component={ProfileNavigator}
          navigationKey={user?.data?.profile?.profile_id?.toString()}
          options={{
            tabBarIcon: ProfileTabBarIcon,
          }}
        />
      )}
    </BottomTab.Navigator>
  );
}
