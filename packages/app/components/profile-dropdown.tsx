import { Share, Platform } from "react-native";

import { useBlock } from "app/hooks/use-block";
import { useReport } from "app/hooks/use-report";
import { useUser } from "app/hooks/use-user";
import { track } from "app/lib/analytics";
import { useRouter } from "app/navigation/use-router";
import type { Profile } from "app/types";

import { Button } from "design-system";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "design-system/dropdown-menu";
import { MoreHorizontal } from "design-system/icon";
import { tw } from "design-system/tailwind";

type Props = {
  user: Profile;
};

function ProfileDropdown({ user }: Props) {
  const { isAuthenticated } = useUser();
  const { report } = useReport();
  const { block, unblock, getIsBlocked } = useBlock();
  const router = useRouter();

  const isBlocked = getIsBlocked(user.profile_id);
  //#region callbacks
  const handleOnBlockPress = async () => {
    if (isAuthenticated) {
      await block(user.profile_id);
      router.pop();
    } else {
      router.push(
        Platform.select({
          native: "/login",
          web: {
            pathname: router.pathname,
            query: { ...router.query, login: true },
          },
        }),
        "/login",
        { shallow: true }
      );
    }
  };
  const handleOnUnblockPress = async () => {
    if (isAuthenticated) {
      await unblock(user.profile_id);
      router.pop();
    } else {
      router.push(
        Platform.select({
          native: "/login",
          web: {
            pathname: router.pathname,
            query: { ...router.query, login: true },
          },
        }),
        "/login",
        { shallow: true }
      );
    }
  };
  //#endregion

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button variant="tertiary" iconOnly={true} size="small" asChild>
          <MoreHorizontal
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        loop
        tw="w-60 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow"
      >
        <DropdownMenuItem
          onSelect={async () => {
            const share = await Share.share({
              url: `https://showtime.io/${
                user?.username ??
                user?.wallet_addresses_excluding_email_v2?.[0]?.address
              }`,
            });

            if (share.action === "sharedAction") {
              track(
                "User Shared",
                share.activityType ? { type: share.activityType } : undefined
              );
            }
          }}
          key="share"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Share
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        {!isBlocked ? (
          <DropdownMenuItem
            key="block"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
            onSelect={handleOnBlockPress}
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Block
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            key="block"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
            onSelect={handleOnUnblockPress}
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Unblock User
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          onSelect={async () => {
            await report({ userId: user.profile_id });
            router.pop();
          }}
          key="report"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Report
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { ProfileDropdown };
