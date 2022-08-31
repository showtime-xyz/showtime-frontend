import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@showtime-xyz/universal.dropdown-menu";
import {
  MoreHorizontal,
  Copy,
  Flag,
  Slash,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { tw } from "@showtime-xyz/universal.tailwind";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { useBlock } from "app/hooks/use-block";
import { useReport } from "app/hooks/use-report";
import { useShare } from "app/hooks/use-share";
import { useRudder } from "app/lib/rudderstack";
import type { Profile } from "app/types";

type Props = {
  user: Profile;
};

function ProfileDropdown({ user }: Props) {
  const { rudder } = useRudder();
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
              rudder.track(
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
