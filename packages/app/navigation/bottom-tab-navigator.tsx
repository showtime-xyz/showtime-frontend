import { useContext } from "react";
import { useWindowDimensions } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { CreateTabBarIcon } from "app/components/upload/tab-bar-icon";
import { UserContext } from "app/context/user-context";
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

const EmptyComponent = () => null;

export function BottomTabNavigator() {
  const { width } = useWindowDimensions();
  const user = useContext(UserContext);

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
      <BottomTab.Screen
        name="uploadTab"
        component={EmptyComponent}
        options={{
          tabBarIcon: CreateTabBarIcon,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
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
          navigationKey={user?.user?.data?.profile?.profile_id?.toString()}
          component={ProfileNavigator}
          options={{
            tabBarIcon: ProfileTabBarIcon,
          }}
        />
      )}
    </BottomTab.Navigator>
  );
}
