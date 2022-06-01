import { useCallback, memo } from "react";

import { useAlert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import type { ButtonProps } from "@showtime-xyz/universal.button/types";

import { useMyInfo } from "app/hooks/api-hooks";

type ToggleFollowParams = Pick<ButtonProps, "size"> & {
  isFollowing: boolean | 0 | undefined;
  name?: string;
  profileId: number;
};

export const FollowButton = memo<ToggleFollowParams>(
  ({ isFollowing, profileId, name, ...rest }) => {
    const { unfollow, follow } = useMyInfo();
    const Alert = useAlert();

    const toggleFollow = useCallback(() => {
      if (isFollowing) {
        Alert.alert(`Unfollow ${name ? `@${name}` : ""}?`, "", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Unfollow",
            style: "destructive",
            onPress: () => {
              unfollow(profileId);
            },
          },
        ]);
      } else {
        follow(profileId);
      }
    }, [Alert, follow, unfollow, isFollowing, profileId, name]);

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
