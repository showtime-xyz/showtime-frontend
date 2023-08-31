import { useCallback, memo, useMemo } from "react";

import { Button } from "@showtime-xyz/universal.button";
import type { ButtonProps } from "@showtime-xyz/universal.button";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";

import { FollowButton } from "./follow-button";

type ToggleFollowParams = ButtonProps & {
  name?: string;
  profileId: number;
  onToggleFollow?: () => void;
  channelId?: number;
};

export const FollowButtonSmall = memo<ToggleFollowParams>(
  function FollowButtonSmall({ profileId, name, tw = "", channelId, ...rest }) {
    const router = useRouter();
    return (
      <FollowButton
        profileId={profileId}
        name={name}
        renderButton={({ text, isFollowing, ...rest }) => {
          if (channelId && isFollowing) {
            return (
              <Pressable
                tw={[
                  "h-[22px] items-center justify-center rounded-full bg-indigo-600 px-3.5",
                  tw,
                ]}
                onPress={() => router.push(`/channels/${channelId}`)}
              >
                <Text tw="text-xs font-bold text-white">View Channel</Text>
              </Pressable>
            );
          }
          return (
            <Pressable
              tw={[
                "h-[22px] items-center justify-center rounded-full border border-gray-300 px-3.5 dark:border-gray-600",
                tw,
              ]}
              {...rest}
            >
              <Text tw="text-xs font-bold text-gray-900 dark:text-white">
                {text}
              </Text>
            </Pressable>
          );
        }}
        {...rest}
      />
    );
  }
);

FollowButton.displayName = "FollowButton";
