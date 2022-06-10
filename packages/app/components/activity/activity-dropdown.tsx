import { useSWRConfig } from "swr";

import { Button } from "@showtime-xyz/universal.button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@showtime-xyz/universal.dropdown-menu";
import { MoreHorizontal } from "@showtime-xyz/universal.icon";
import { tw } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { useMyInfo } from "app/hooks/api-hooks";
import { useReport } from "app/hooks/use-report";
import { useUser } from "app/hooks/use-user";

type Props = {
  activity: any; // TODO: add Activity type
};

function ActivityDropdown({ activity }: Props) {
  const { mutate } = useSWRConfig();
  const { report } = useReport();
  const { unfollow } = useMyInfo();
  const { isAuthenticated } = useUser();

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <View tw="h-8 w-8">
          <Button
            variant="tertiary"
            tw="h-8 rounded-full p-2"
            iconOnly={true}
            asChild
          >
            <MoreHorizontal
              width={24}
              height={24}
              color={
                tw.style("bg-black dark:bg-white")?.backgroundColor as string
              }
            />
          </Button>
        </View>
      </DropdownMenuTrigger>

      <DropdownMenuContent loop>
        {isAuthenticated && (
          <DropdownMenuItem
            onSelect={async () => {
              await unfollow(activity.actor_id);
              mutate(null);
            }}
            key="unfollow"
          >
            <DropdownMenuItemTitle>Unfollow</DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {isAuthenticated && <DropdownMenuSeparator />}

        <DropdownMenuItem
          onSelect={() => {
            report({ activityId: activity.id });
          }}
          key="report"
        >
          <DropdownMenuItemTitle>Report</DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { ActivityDropdown };
