import { Platform } from "react-native";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";

import { Messages } from "app/components/creator-channels/messages";
import { useNetWorkConnection } from "app/hooks/use-network-connection";
import { screenOptions } from "app/navigation/navigator-screen-options";
import { AppleMusicAuthNativeWebViewScreen } from "app/screens/apple-music-auth-native-webview";
import { BlockedListScreen } from "app/screens/blocked-list";
import { ClaimScreen } from "app/screens/claim";
import { ClaimLimitExplanationScreen } from "app/screens/claim-limit-explanation";
import { CollectorsScreen } from "app/screens/collectors";
import { CommentsScreen } from "app/screens/comments";
import { CreatorChannelsCongratsScreen } from "app/screens/creator-channels-congrats";
import { CreatorChannelsIntroScreen } from "app/screens/creator-channels-intro";
import { CreatorChannelsMembersScreen } from "app/screens/creator-channels-members";
import { CreatorChannelsMessageReactionsScreen } from "app/screens/creator-channels-message-reactions";
import { CreatorChannelsSettingsScreen } from "app/screens/creator-channels-settings";
import { CreatorChannelsShareScreen } from "app/screens/creator-channles-share";
import { DetailsScreen } from "app/screens/details";
import { DropScreen } from "app/screens/drop";
import { DropEditDetailsScreen } from "app/screens/drop-edit-details";
import { DropExplanationScreen } from "app/screens/drop-explanation";
import { DropUpdateScreen } from "app/screens/drop-update";
import { DropViewShareScreen } from "app/screens/drop-view-share";
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
import { RaffleScreen } from "app/screens/raffle";
import { ReportScreen } from "app/screens/report";
import { SearchScreen } from "app/screens/search";
import { SettingsScreen } from "app/screens/settings";
import { AddEmailScreen } from "app/screens/settings-add-email";
import { VerifyPhoneNumberScreen } from "app/screens/settings-verify-phone-number";
import { TrendingScreen } from "app/screens/trending";

import { DropFreeScreen } from "../screens/drop-free";
import { OnboardingScreen } from "../screens/onboarding";
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
      <Stack.Group
        screenOptions={{
          headerShown: false,
          fullScreenGestureEnabled: true,
          animationDuration: Platform.OS === "ios" ? 400 : undefined,
          animation: Platform.OS === "android" ? "fade_from_bottom" : "default",
          statusBarStyle: isDark ? "light" : "dark",
        }}
      >
        <Stack.Screen
          name="profile"
          component={ProfileScreen}
          getId={({ params }) => params?.username}
          options={{
            statusBarStyle: "light",
          }}
        />
        <Stack.Screen
          name="search"
          component={SearchScreen}
          options={{
            animation: Platform.OS === "android" ? "fade_from_bottom" : "fade",
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="nft"
          component={NftScreen}
          getId={({ params }) => Object.values(params).join("-")}
          options={{
            statusBarStyle: "light",
          }}
        />
        <Stack.Screen
          name="dropSlug"
          component={NftScreen}
          getId={({ params }) => Object.values(params).join("-")}
          options={{
            statusBarStyle: "light",
          }}
        />
        <Stack.Screen name="channelsMessage" component={Messages} />
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

        <Stack.Screen
          name="channelsMembers"
          options={{ headerTitle: "Members" }}
          component={CreatorChannelsMembersScreen}
        />
        <Stack.Screen
          name="dropUpdate"
          options={{ headerTitle: "Update Spotify Link" }}
          component={DropUpdateScreen}
        />
        <Stack.Screen
          name="channelsMessageReactions"
          component={CreatorChannelsMessageReactionsScreen}
        />
        <Stack.Screen
          name="trending"
          options={{ headerTitle: "Trending" }}
          component={TrendingScreen}
        />
      </Stack.Group>

      {/* Modals */}
      <Stack.Group
        screenOptions={{
          headerShown: false,
          animation: Platform.OS === "ios" ? "default" : "none",
          presentation: Platform.OS === "ios" ? "modal" : "transparentModal",
        }}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="details" component={DetailsScreen} />
        <Stack.Screen name="editProfile" component={EditProfileScreen} />
        <Stack.Screen
          name="appleMusicAuthNativeWebView"
          component={AppleMusicAuthNativeWebViewScreen}
        />
        <Stack.Screen
          name="onboarding"
          component={OnboardingScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="addEmail" component={AddEmailScreen} />
        <Stack.Screen
          name="verifyPhoneNumber"
          component={VerifyPhoneNumberScreen}
        />
        <Stack.Screen
          name="dropExplanation"
          component={DropExplanationScreen}
        />

        <Stack.Screen
          name="dropFree"
          component={DropFreeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="claim" component={ClaimScreen} />
        <Stack.Screen name="qrCodeShare" component={QRCodeShareScreen} />
        <Stack.Screen
          name="dropViewShareModal"
          component={DropViewShareScreen}
        />
        <Stack.Screen
          name="dropEditDetailsModal"
          component={DropEditDetailsScreen}
        />
        <Stack.Screen name="raffle" component={RaffleScreen} />
        <Stack.Screen
          name="channelsIntro"
          options={{ gestureEnabled: false }}
          component={CreatorChannelsIntroScreen}
        />
        <Stack.Screen
          name="channelsCongrats"
          component={CreatorChannelsCongratsScreen}
        />
        <Stack.Screen
          name="channelsShare"
          component={CreatorChannelsShareScreen}
        />
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
        <Stack.Screen name="report" component={ReportScreen} />
        <Stack.Screen name="drop" component={DropScreen} />
        <Stack.Screen
          name="channelsSettings"
          component={CreatorChannelsSettingsScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
