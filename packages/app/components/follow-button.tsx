import { useCallback, memo, useMemo } from "react";

import { useMyInfo } from "app/hooks/api-hooks";

import { Alert } from "design-system/alert";
import { Button } from "design-system/button";
import type { ButtonProps } from "design-system/button/types";

type ToggleFollowParams = ButtonProps & {
  name?: string;
  profileId: number;
  onToggleFollow?: () => void;
};

export const FollowButton = memo<ToggleFollowParams>(
  ({ profileId, name, onToggleFollow, ...rest }) => {
    const { unfollow, follow, data, isFollowing: isFollowingFn } = useMyInfo();

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
    }, [follow, unfollow, isFollowing, profileId, name, onToggleFollow]);
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
