import { Share } from "react-native";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "design-system/dropdown-menu";
import { Button } from "design-system";
import { MoreHorizontal } from "design-system/icon";
import { tw } from "design-system/tailwind";
import type { Profile } from "app/types";
import { useReport } from "app/hooks/use-report";
import { useRouter } from "app/navigation/use-router";
import { useMyInfo } from "app/hooks/api-hooks";
import { useUser } from "app/hooks/use-user";

type Props = {
  user: Profile;
};

function ProfileDropdown({ user }: Props) {
  const { isAuthenticated } = useUser();
  const { isFollowing, follow, unfollow } = useMyInfo();
  const { reportUser, blockUser } = useReport();
  const router = useRouter();

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button variant="tertiary" iconOnly={true} size="regular" asChild>
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
          onSelect={() =>
            Share.share({
              url: `https://showtime.io/${user.username}`,
            })
          }
          key="share"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Share
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        {isAuthenticated && (
          <DropdownMenuItem
            onSelect={async () => {
              await unfollow(user.profile_id);
              await blockUser({ userId: user.profile_id });
              router.pop();
            }}
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
            key="block"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Block
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {isAuthenticated && (
          <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />
        )}

        <DropdownMenuItem
          onSelect={async () => {
            await unfollow(user.profile_id);
            await reportUser({ userId: user.profile_id });
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
