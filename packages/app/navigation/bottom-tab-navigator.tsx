import { useWindowDimensions } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import dynamic from "next/dynamic";

import { useExpoUpdate } from "app/hooks/use-expo-update";
import { useUser } from "app/hooks/use-user";

import { BottomTabbar } from "./bottom-tab-bar";
import {
  CreateTabBarIcon,
  HomeTabBarIcon,
  NotificationsTabBarIcon,
  ProfileTabBarIcon,
  TrendingTabBarIcon,
} from "./tab-bar-icons";

const HomeNavigator = dynamic(() => import("../pages/home"));
const TrendingNavigator = dynamic(() => import("../pages/trending"));
const CreateNavigator = dynamic(() => import("../pages/create"));
const NotificationsNavigator = dynamic(() => import("../pages/notifications"));
const ProfileNavigator = dynamic(() => import("../pages/profile"));

const BottomTab = createBottomTabNavigator();

export function BottomTabNavigator() {
  const { width } = useWindowDimensions();
  const { user } = useUser();

  useExpoUpdate();

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
        name="trendingTab"
        component={TrendingNavigator}
        options={{
          tabBarIcon: TrendingTabBarIcon,
        }}
      />
      {width < 768 && (
        <BottomTab.Screen
          name="createTab"
          component={CreateNavigator}
          options={{
            tabBarIcon: CreateTabBarIcon,
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
