import React from "react";

import { useSWRConfig } from "swr";

import { useMyInfo } from "app/hooks/api-hooks";
import { useReport } from "app/hooks/use-report";
import { useUser } from "app/hooks/use-user";

import { Button } from "design-system/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import { MoreHorizontal } from "design-system/icon";
import { tw } from "design-system/tailwind";
import { View } from "design-system/view";

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
