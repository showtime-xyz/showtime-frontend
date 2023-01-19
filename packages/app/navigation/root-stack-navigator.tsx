import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { useNetWorkConnection } from "app/hooks/use-network-connection";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { BlockedListScreen } from "app/screens/blocked-list";
import { ClaimScreen } from "app/screens/claim";
import { ClaimLimitExplanationScreen } from "app/screens/claim-limit-explanation";
import { CollectorsScreen } from "app/screens/collectors";
import { CommentsScreen } from "app/screens/comments";
import { CompleteProfileScreen } from "app/screens/complete-profile";
import { DetailsScreen } from "app/screens/details";
import { DropScreen } from "app/screens/drop";
import { EditProfileScreen } from "app/screens/edit-profile";
import { FollowersScreen } from "app/screens/followers";
import { FollowingScreen } from "app/screens/following";
import { LikersScreen } from "app/screens/likers";
import { LoginScreen } from "app/screens/login";
import { NftScreen } from "app/screens/nft";
import { NotificationSettingsScreen } from "app/screens/notification-settings";
import { PrivacySecuritySettingsScreen } from "app/screens/privacy-and-security-settings";
import { ProfileScreen } from "app/screens/profile";
import { QRCodeShareScreen } from "app/screens/qr-code-share";
import { ReportScreen } from "app/screens/report";
import { SearchScreen } from "app/screens/search";
import { SettingsScreen } from "app/screens/settings";
import { AddEmailScreen } from "app/screens/settings-add-email";
import { VerifyPhoneNumberScreen } from "app/screens/settings-verify-phone-number";
import { SwipeListScreen } from "app/screens/swipe-list";

import { DropEventScreen } from "../screens/drop-event";
import { DropFreeScreen } from "../screens/drop-free";
import { DropMusicScreen } from "../screens/drop-music";
import { DropPrivateScreen } from "../screens/drop-private";
import { BottomTabNavigator } from "./bottom-tab-navigator";
import { createStackNavigator } from "./create-stack-navigator";
import { RootStackNavigatorParams } from "./types";

const Stack = createStackNavigator<RootStackNavigatorParams>();

export function RootStackNavigator() {
  const { top: safeAreaTop } = useSafeAreaInsets();
  useNetWorkConnection();

  const isDark = useIsDarkMode();

  return (
    <Stack.Navigator>
      {/* Bottom tab navigator */}
      <Stack.Screen
        name="bottomTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      {/* Screens without default header */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="profile"
          component={ProfileScreen}
          getId={({ params }) => params?.username}
        />
        <Stack.Screen
          name="search"
          component={SearchScreen}
          options={{
            animation: "none",
          }}
        />
      </Stack.Group>

      {/* Screens accessible in most of the navigators */}
      <Stack.Group screenOptions={screenOptions({ safeAreaTop, isDark })}>
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
          name="swipeList"
          component={SwipeListScreen}
          getId={({ params }) => {
            return params?.profileId ?? params.type;
          }}
        />
        <Stack.Screen
          name="followers"
          component={FollowersScreen}
          options={{ headerTitle: "Followers" }}
        />
        <Stack.Screen
          name="following"
          options={{ headerTitle: "Following" }}
          component={FollowingScreen}
        />
        <Stack.Screen
          name="collectors"
          options={{ headerTitle: "Collectors" }}
          component={CollectorsScreen}
        />
        <Stack.Screen
          name="likers"
          options={{ headerTitle: "Likers" }}
          component={LikersScreen}
        />
        <Stack.Screen
          name="comments"
          options={{ headerTitle: "Comments" }}
          component={CommentsScreen}
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
        <Stack.Screen name="details" component={DetailsScreen} />
        <Stack.Screen name="editProfile" component={EditProfileScreen} />
        <Stack.Screen
          name="completeProfile"
          component={CompleteProfileScreen}
        />

        <Stack.Screen name="addEmail" component={AddEmailScreen} />
        <Stack.Screen
          name="verifyPhoneNumber"
          component={VerifyPhoneNumberScreen}
        />
        <Stack.Screen name="drop" component={DropScreen} />
        <Stack.Screen name="dropMusic" component={DropMusicScreen} />
        <Stack.Screen name="dropFree" component={DropFreeScreen} />
        <Stack.Screen name="dropEvent" component={DropEventScreen} />
        <Stack.Screen name="dropPrivate" component={DropPrivateScreen} />
        <Stack.Screen name="claim" component={ClaimScreen} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          headerShown: false,
          animation: "none",
          presentation: "transparentModal",
        }}
      >
        <Stack.Screen
          name="claimLimitExplanation"
          component={ClaimLimitExplanationScreen}
        />
        <Stack.Screen name="qrCodeShare" component={QRCodeShareScreen} />
        <Stack.Screen name="report" component={ReportScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
