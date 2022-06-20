import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { tw } from "@showtime-xyz/universal.tailwind";

import { useBlock } from "app/hooks/use-block";
import { useReport } from "app/hooks/use-report";
import { useShare } from "app/hooks/use-share";
import { track } from "app/lib/analytics";
import { useRouter } from "app/navigation/use-router";
import type { Profile } from "app/types";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuItemIcon,
} from "design-system/dropdown-menu";
import { MoreHorizontal, Copy, Flag, Slash } from "design-system/icon";

const MenuItemIcon = ({ Icon }) => {
  return (
    <DropdownMenuItemIcon>
      <Icon
        width="1em"
        height="1em"
        color={
          tw.style("bg-gray-400 dark:bg-gray-500")?.backgroundColor as string
        }
      />
    </DropdownMenuItemIcon>
  );
};

type Props = {
  user: Profile;
};

function ProfileDropdown({ user }: Props) {
  const { report } = useReport();
  const { getIsBlocked, toggleBlock } = useBlock();
  const router = useRouter();
  const share = useShare();
  const { width } = useWindowDimensions();
  const isBlocked = getIsBlocked(user.profile_id);

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

      <DropdownMenuContent loop>
        <DropdownMenuItem
          onSelect={async () => {
            const result = await share({
              url: `https://showtime.xyz/${
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
        >
          <MenuItemIcon Icon={Copy} />
          <DropdownMenuItemTitle>Share</DropdownMenuItemTitle>
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
          <MenuItemIcon Icon={Slash} />
          <DropdownMenuItemTitle>
            {isBlocked ? "Unblock User" : "Block User"}
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={async () => {
            await report({ userId: user.profile_id });
            router.pop();
          }}
          key="report"
        >
          <MenuItemIcon Icon={Flag} />
          <DropdownMenuItemTitle>Report</DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { ProfileDropdown };
