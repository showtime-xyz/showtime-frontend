import { useCallback, memo, useMemo } from "react";

import { Alert } from "@showtime-xyz/universal.alert";
import { Button } from "@showtime-xyz/universal.button";
import type { ButtonProps } from "@showtime-xyz/universal.button";

import { useMyInfo } from "app/hooks/api-hooks";

type ToggleFollowParams = ButtonProps & {
  name?: string;
  profileId: number;
  onToggleFollow?: () => void;
  renderButton?: ({
    isFollowing,
    onPress,
    text,
  }: {
    isFollowing: boolean;
    onPress: () => void;
    text: string;
  }) => React.ReactNode;
};

export const FollowButton = memo<ToggleFollowParams>(function FollowButton({
  profileId,
  name,
  onToggleFollow,
  renderButton,
  ...rest
}) {
  const { unfollow, follow, data, isFollowing: isFollowingFn } = useMyInfo();

  const isFollowing = useMemo(
    () => isFollowingFn(profileId),
    [profileId, isFollowingFn]
  );

  const text = useMemo(
    () => (isFollowing ? "Following" : "Follow"),
    [isFollowing]
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
  if (renderButton) {
    return (
      <>
        {renderButton({
          isFollowing,
          onPress: toggleFollow,
          text,
        })}
      </>
    );
  }
  return (
    <Button
      variant={isFollowing ? "tertiary" : "primary"}
      onPress={toggleFollow}
      {...rest}
    >
      {text}
    </Button>
  );
});

FollowButton.displayName = "FollowButton";
