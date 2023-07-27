import { useWindowDimensions } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";

import { HeaderLeft } from "app/components/header";
import { NotificationsSettingIcon } from "app/components/header/notifications-setting-icon";
import CreateNavigator from "app/pages/create";
import { CreatorChannelsHeaderRight } from "app/pages/creator-channels";
import HomeNavigator from "app/pages/home";
import NotificationsNavigator from "app/pages/notifications";
import ProfileNavigator from "app/pages/profile";
import { CreatorChannelsScreen } from "app/screens/creator-channels";
import { HomeScreenV2 } from "app/screens/homev2";
import { NotificationsScreen } from "app/screens/notifications";
import ProfileScreen from "app/screens/profile";

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
        component={HomeScreenV2}
        options={{
          headerShown: true,
          tabBarIcon: HomeTabBarIcon,
          headerTransparent: true,
          headerBackground: () => (
            <BlurView
              intensity={78}
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
              tint="dark"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="channelsTab"
        component={CreatorChannelsScreen}
        options={{
          tabBarIcon: CreatorChannelsTabBarIcon,
          headerRight: CreatorChannelsHeaderRight,
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
          component={NotificationsScreen}
          options={{
            tabBarIcon: NotificationsTabBarIcon,
            headerTitleStyle: { fontSize: 16, fontWeight: "600" },
            headerTitleAlign: "center" as "center",
            title: "Notifications",
            headerTransparent: true,
            headerShown: true,
            headerBackground: () => (
              <BlurView intensity={100} style={{ flex: 1 }} />
            ),
            headerRightContainerStyle: {
              paddingRight: 12,
            },
            headerShadowVisible: false,
            headerRight: () => <NotificationsSettingIcon />,
          }}
        />
      )}
      {width < 768 && (
        <BottomTab.Screen
          name="profileTab"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ProfileTabBarIcon,
          }}
        />
      )}
    </BottomTab.Navigator>
  );
}
