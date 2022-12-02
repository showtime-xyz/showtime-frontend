import { memo } from "react";
import { useWindowDimensions } from "react-native";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import type { ButtonProps } from "@showtime-xyz/universal.button/types";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { BellOff, BellPlus } from "@showtime-xyz/universal.icon";

import { useUserProfile } from "app/hooks/api-hooks";
import { useAuth } from "app/hooks/auth/use-auth";
import { useNotificationsFollow } from "app/hooks/use-notifications-follow";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

type NotificationsFollowButtonProps = ButtonProps & {
  username?: string;
  profileId: number;
};

export const NotificationsFollowButton = memo<NotificationsFollowButtonProps>(
  ({ profileId, username }) => {
    const { accessToken } = useAuth();
    const navigateToLogin = useNavigateToLogin();

    const { mutate, data } = useUserProfile({ address: username });
    const isFollowingCreatorDrops = data?.data?.following_creator_drops;
    const { width } = useWindowDimensions();
    const isDark = useIsDarkMode();
    const { notificationsFollow, notificationsUnfollow } =
      useNotificationsFollow();
    const onToggleNotifacationFollow = async () => {
      if (!accessToken) {
        navigateToLogin();
        return;
      }
      if (isFollowingCreatorDrops) {
        Alert.alert(`Turn off @${username} Drops notifications?`, "", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            style: "destructive",
            onPress: async () => {
              await notificationsUnfollow(profileId);
              await mutate();
            },
          },
        ]);
      } else {
        await notificationsFollow(profileId);
        await mutate();
      }
    };
    return (
      <Button
        variant="tertiary"
        iconOnly
        size={width < 768 ? "small" : "regular"}
        onPress={onToggleNotifacationFollow}
      >
        {isFollowingCreatorDrops ? (
          <BellOff width={24} height={24} color={isDark ? "#FFF" : "#000"} />
        ) : (
          <BellPlus width={24} height={24} color={isDark ? "#FFF" : "#000"} />
        )}
      </Button>
    );
  }
);

NotificationsFollowButton.displayName = "NotificationsFollowButton";
