import { useCallback, memo, useMemo } from "react";

import { Button } from "@showtime-xyz/universal.button";
import type { ButtonProps } from "@showtime-xyz/universal.button";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";

import { FollowButton } from "./follow-button";

type ToggleFollowParams = ButtonProps & {
  name?: string;
  profileId: number;
  onToggleFollow?: () => void;
};

export const FollowButtonSmall = memo<ToggleFollowParams>(
  function FollowButtonSmall({ profileId, name, tw = "", ...rest }) {
    return (
      <FollowButton
        profileId={profileId}
        name={name}
        renderButton={({ text, ...rest }) => {
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
