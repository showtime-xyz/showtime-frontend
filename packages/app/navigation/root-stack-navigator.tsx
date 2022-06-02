import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { screenOptions } from "app/navigation/navigator-screen-options";
import { ActivitiesScreen } from "app/screens/activities";
import { BlockedListScreen } from "app/screens/blocked-list";
import { ClaimScreen } from "app/screens/claim";
import { CommentsScreen } from "app/screens/comments";
import { CreateScreen } from "app/screens/create";
import { DeleteScreen } from "app/screens/delete";
import { DetailsScreen } from "app/screens/details";
import { DropScreen } from "app/screens/drop";
import { EditProfileScreen } from "app/screens/edit-profile";
import { ListScreen } from "app/screens/list";
import { LoginScreen } from "app/screens/login";
import { NftScreen } from "app/screens/nft";
import { NotificationSettingsScreen } from "app/screens/notification-settings";
import { PrivacySecuritySettingsScreen } from "app/screens/privacy-and-security-settings";
import { ProfileScreen } from "app/screens/profile";
import { SearchScreen } from "app/screens/search";
import { SettingsScreen } from "app/screens/settings";
import { SwipeListScreen } from "app/screens/swipe-list";
import { TransferScreen } from "app/screens/transfer";
import { UnlistScreen } from "app/screens/unlist";

import { BottomTabNavigator } from "./bottom-tab-navigator";
import { createStackNavigator } from "./create-stack-navigator";

const Stack = createStackNavigator();

export function RootStackNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const isDark = useIsDarkMode();

  return (
    <Stack.Navigator>
      {/* Bottom tab navigator */}
      <Stack.Screen
        name="bottomTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      {/* Screens accessible in most of the navigators */}
      <Stack.Group
        // @ts-ignore
        screenOptions={screenOptions({ safeAreaTop, isDark })}
      >
        <Stack.Screen
          name="profile"
          component={ProfileScreen}
          getId={({ params }) => params?.username}
        />
        <Stack.Screen name="settings" component={SettingsScreen} />
        <Stack.Screen
          name="privacySecuritySettings"
          component={PrivacySecuritySettingsScreen}
        />
        <Stack.Screen
          name="notificationSettings"
          component={NotificationSettingsScreen}
        />
        <Stack.Screen name="blockedList" component={BlockedListScreen} />
        <Stack.Screen
          name="search"
          component={SearchScreen}
          options={{
            animation: "none",
          }}
        />
        <Stack.Screen
          name="swipeList"
          component={SwipeListScreen}
          getId={({ params }) => params?.type}
        />
        <Stack.Screen name="nft" component={NftScreen} />
      </Stack.Group>

      {/* Modals */}
      <Stack.Group
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "ios" ? "default" : "none",
          presentation:
            Platform.OS === "ios" ? "formSheet" : "transparentModal",
        }}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="comments" component={CommentsScreen} />
        <Stack.Screen name="transfer" component={TransferScreen} />
        <Stack.Screen name="create" component={CreateScreen} />
        <Stack.Screen name="delete" component={DeleteScreen} />
        <Stack.Screen name="list" component={ListScreen} />
        <Stack.Screen name="unlist" component={UnlistScreen} />
        <Stack.Screen name="details" component={DetailsScreen} />
        <Stack.Screen name="activities" component={ActivitiesScreen} />
        <Stack.Screen name="editProfile" component={EditProfileScreen} />
        <Stack.Screen name="drop" component={DropScreen} />
        <Stack.Screen name="claim" component={ClaimScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
