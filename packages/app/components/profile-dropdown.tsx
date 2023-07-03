import { useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Copy,
  Flag,
  Slash,
  UserMinus,
  UserPlus,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { useMyInfo } from "app/hooks/api-hooks";
import { useBlock } from "app/hooks/use-block";
import { useShare } from "app/hooks/use-share";
import { Analytics, EVENTS } from "app/lib/analytics";
import type { Profile } from "app/types";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";

type Props = {
  user: Profile;
  tw?: string;
};

function ProfileDropdown({ user, tw = "" }: Props) {
  const { getIsBlocked, toggleBlock } = useBlock();
  const router = useRouter();
  const { share } = useShare();
  const { width } = useWindowDimensions();
  const isBlocked = getIsBlocked(user.profile_id);
  const isDark = useIsDarkMode();
  const showFollowButton = typeof user?.channels?.[0]?.id !== "undefined";
  const { unfollow, follow, isFollowing: isFollowingFn } = useMyInfo();

  const isFollowing = useMemo(
    () => isFollowingFn(user.profile_id),
    [user.profile_id, isFollowingFn]
  );

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button
          variant="tertiary"
          iconOnly
          size={width < 768 ? "small" : "regular"}
          tw={tw}
        >
          <MoreHorizontal
            width={24}
            height={24}
            color={isDark ? "#FFF" : "#000"}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent loop sideOffset={8}>
        <DropdownMenuItem
          onSelect={async () => {
            const result = await share({
              url: `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/@${
                user?.username ??
                user?.wallet_addresses_excluding_email_v2?.[0]?.address
              }`,
            });

            if (result.action === "sharedAction") {
              Analytics.track(
                EVENTS.USER_SHARED_PROFILE,
                result.activityType ? { type: result.activityType } : undefined
              );
            }
          }}
          key="share"
        >
          <MenuItemIcon
            Icon={Copy}
            ios={{
              name: "square.and.arrow.up",
            }}
          />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Share
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem
          key="block"
          className="danger"
          onSelect={() => {
            toggleBlock({
              isBlocked,
              creatorId: user?.profile_id,
              name: user?.name,
            });
          }}
        >
          <MenuItemIcon
            Icon={Slash}
            ios={{
              name: isBlocked ? "circle" : "circle.slash",
            }}
          />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            {isBlocked ? "Unblock User" : "Block User"}
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={async () => {
            router.push(
              {
                pathname: Platform.OS === "web" ? router.pathname : "/report",
                query: {
                  ...router.query,
                  reportModal: true,
                  userId: user.profile_id,
                },
              },
              Platform.OS === "web" ? router.asPath : undefined
            );
          }}
          key="report"
        >
          <MenuItemIcon Icon={Flag} ios={{ name: "flag" }} />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Report
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        {showFollowButton ? (
          <DropdownMenuItem
            key="follow"
            className="danger"
            onSelect={() => {
              if (isFollowing) {
                unfollow(user.profile_id);
              } else {
                follow(user.profile_id);
              }
            }}
          >
            <MenuItemIcon
              Icon={isFollowing ? UserMinus : UserPlus}
              ios={{
                name: isFollowing ? "person.badge.minus" : "person.badge.plus",
              }}
            />
            <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
              {isFollowing ? "Unfollow User" : "Follow User"}
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { ProfileDropdown };
