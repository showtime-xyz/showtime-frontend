import { useContext } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { AppContext } from "app/context/app-context";
import { useAuth } from "app/hooks/auth/use-auth";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { useRouter } from "app/navigation/use-router";

import { Text } from "design-system";
import { Avatar } from "design-system/avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuTriggerItem,
} from "design-system/dropdown-menu";
import { Settings } from "design-system/icon";
import { tw } from "design-system/tailwind";
import { breakpoints } from "design-system/theme";
import { View } from "design-system/view";

function HeaderDropdown({ type }: { type: "profile" | "settings" }) {
  const { logout } = useAuth();
  const router = useRouter();
  const context = useContext(AppContext);
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isMdWidth = width >= breakpoints["md"];

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        {type === "profile" ? (
          <View
            tw="flex h-12 cursor-pointer flex-row items-center justify-center rounded-full p-2"
            style={tw.style(isWeb ? "bg-gray-100 dark:bg-gray-900" : "")}
          >
            <Avatar url={user?.data?.profile?.img_url} />
            {isWeb && isMdWidth && user?.data?.profile?.username ? (
              <Text tw="ml-2 mr-1 font-semibold dark:text-white">
                {`@${user.data.profile.username}`}
              </Text>
            ) : null}
          </View>
        ) : (
          <View tw="h-8 w-8 items-center justify-center rounded-full">
            <Settings
              width={24}
              height={24}
              color={
                tw.style("bg-black dark:bg-white")?.backgroundColor as string
              }
            />
          </View>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        loop
        tw="w-60 rounded-2xl bg-white p-2 shadow dark:bg-gray-900"
      >
        {type === "profile" && (
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/@${user?.data?.profile?.username ?? userAddress}`);
            }}
            key="your-profile"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Profile
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        {type === "profile" && (
          <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />
        )}

        <DropdownMenuItem
          onSelect={() => router.push("/settings")}
          key="your-settings"
          tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Settings
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuRoot>
          <DropdownMenuTriggerItem
            key="nested-group-trigger"
            tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Theme
            </DropdownMenuItemTitle>
          </DropdownMenuTriggerItem>
          <DropdownMenuContent tw="w-30 rounded-2xl bg-white p-2 shadow dark:bg-gray-900">
            <DropdownMenuItem
              onSelect={() => context.setColorScheme("light")}
              key="nested-group-1"
              tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
            >
              <DropdownMenuItemTitle tw="text-black dark:text-white">
                Light
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => context.setColorScheme("dark")}
              key="nested-group-2"
              tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
            >
              <DropdownMenuItemTitle tw="text-black dark:text-white">
                Dark
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>

        <DropdownMenuSeparator tw="m-1 h-[1px] bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          destructive
          onSelect={logout}
          key="sign-out"
          tw="h-8 flex-1 overflow-hidden rounded-sm p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Sign Out
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { HeaderDropdown };
