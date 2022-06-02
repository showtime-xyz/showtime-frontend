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

      <DropdownMenuContent
        loop
        tw="w-60 rounded-2xl bg-white p-2 shadow dark:bg-gray-900"
      >
        {isAuthenticated && (
          <DropdownMenuItem
            onSelect={async () => {
              await unfollow(activity.actor_id);
              mutate(null);
            }}
            key="unfollow"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
              Unfollow
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {isAuthenticated && (
          <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
        )}

        <DropdownMenuItem
          onSelect={() => {
            report({ activityId: activity.id });
          }}
          key="report"
          tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
        >
          <DropdownMenuItemTitle tw="font-semibold text-black dark:text-white">
            Report
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { ActivityDropdown };
