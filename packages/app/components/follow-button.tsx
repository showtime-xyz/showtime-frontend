import { useCallback, memo, useMemo } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import type { ButtonProps } from "@showtime-xyz/universal.button/types";

import { useMyInfo } from "app/hooks/api-hooks";

type ToggleFollowParams = ButtonProps & {
  name?: string;
  profileId: number;
  onToggleFollow?: () => void;
};

export const FollowButton = memo<ToggleFollowParams>(
  ({ profileId, name, onToggleFollow, ...rest }) => {
    const { unfollow, follow, data, isFollowing: isFollowingFn } = useMyInfo();

    const Alert = useAlert();
    const isFollowing = useMemo(
      () => isFollowingFn(profileId),
      [profileId, isFollowingFn]
    );

    const toggleFollow = useCallback(async () => {
      if (isFollowing) {
        Alert.alert(`Unfollow ${name ? `@${name}` : ""}?`, "", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Unfollow",
            style: "destructive",
            onPress: async () => {
              await unfollow(profileId);
              onToggleFollow?.();
            },
          },
        ]);
      } else {
        await follow(profileId);
        onToggleFollow?.();
      }
    }, [Alert, follow, unfollow, isFollowing, profileId, name, onToggleFollow]);
    if (data?.data?.profile?.profile_id === profileId) return null;
    return (
      <Button
        variant={isFollowing ? "tertiary" : "primary"}
        onPress={toggleFollow}
        {...rest}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    );
  }
);

FollowButton.displayName = "FollowButton";
