import { useCallback, memo } from "react";

import { useMyInfo } from "app/hooks/api-hooks";

import { Button } from "design-system";
import { useAlert } from "design-system/alert";
import type { ButtonProps } from "design-system/button/types";

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
