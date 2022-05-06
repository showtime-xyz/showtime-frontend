import { Platform, useWindowDimensions } from "react-native";

import { useBlock } from "app/hooks/use-block";
import { useReport } from "app/hooks/use-report";
import { useShare } from "app/hooks/use-share";
import { useUser } from "app/hooks/use-user";
import { track } from "app/lib/analytics";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";
import { useRouter } from "app/navigation/use-router";
import type { Profile } from "app/types";

import { Button } from "design-system";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  const share = useShare();
  const { width } = useWindowDimensions();
  const isBlocked = getIsBlocked(user.profile_id);
  const navigateToLogin = useNavigateToLogin();

  //#region callbacks
  const handleOnBlockPress = async () => {
    if (isAuthenticated) {
      await block(user.profile_id);
      router.pop();
    } else {
      navigateToLogin();
    }
  };
  const handleOnUnblockPress = async () => {
    if (isAuthenticated) {
      await unblock(user.profile_id);
      router.pop();
    } else {
      navigateToLogin();
    }
  };
  //#endregion

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button
          variant="tertiary"
          iconOnly={true}
          size={width < 768 ? "small" : "regular"}
          asChild
        >
          <MoreHorizontal
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        loop
        tw="w-60 rounded-2xl bg-white p-2 shadow dark:bg-gray-900"
      >
        <DropdownMenuItem
          onSelect={async () => {
            const result = await share({
              url: `https://showtime.io/${
                user?.username ??
                user?.wallet_addresses_excluding_email_v2?.[0]?.address
              }`,
            });

            if (result.action === "sharedAction") {
              track(
                "User Shared",
                result.activityType ? { type: result.activityType } : undefined
              );
            }
          }}
          key="share"
          tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Share
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />

        {!isBlocked ? (
          <DropdownMenuItem
            key="block"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
            onSelect={handleOnBlockPress}
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Block
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            key="block"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
            onSelect={handleOnUnblockPress}
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Unblock User
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          onSelect={async () => {
            await report({ userId: user.profile_id });
            router.pop();
          }}
          key="report"
          tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
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
