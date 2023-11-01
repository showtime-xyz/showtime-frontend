import { useContext } from "react";
import { useWindowDimensions } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { UserContext } from "app/context/user-context";
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
  const user = useContext(UserContext);
  const canCreateMusicDrop =
    !!user?.user?.data.profile.bypass_track_ownership_validation ||
    !!user?.user?.data.profile.spotify_artist_id ||
    !!user?.user?.data.profile.apple_music_artist_id;

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
      {canCreateMusicDrop && width < 768 && (
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
