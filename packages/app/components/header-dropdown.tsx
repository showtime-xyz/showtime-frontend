import { Platform, useWindowDimensions } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuTriggerItem,
} from "@showtime-xyz/universal.dropdown-menu";
import {
  User,
  Settings,
  Edit,
  Moon,
  Sun,
  LogOut,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { useAuth } from "app/hooks/auth/use-auth";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";

import { breakpoints } from "design-system/theme";

function HeaderDropdown({ type }: { type: "profile" | "settings" }) {
  const { logout } = useAuth();
  const router = useRouter();
  const context = useColorScheme();
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isMdWidth = width >= breakpoints["md"];
  const isLightTheme = context.colorScheme === "light";

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        {type === "profile" ? (
          <View tw="flex h-12 cursor-pointer flex-row items-center justify-center rounded-full bg-gray-100 px-2 dark:bg-gray-900">
            <Avatar url={user?.data?.profile?.img_url} />
            {isWeb && isMdWidth && user?.data?.profile?.username ? (
              <Text tw="ml-2 mr-1 font-semibold dark:text-white ">
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

      <DropdownMenuContent loop>
        {type === "profile" && (
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/@${user?.data?.profile?.username ?? userAddress}`);
            }}
            key="your-profile"
          >
            <MenuItemIcon Icon={User} />
            <DropdownMenuItemTitle>Profile</DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onSelect={() => router.push("/settings")}
          key="your-settings"
        >
          <MenuItemIcon Icon={Settings} />
          <DropdownMenuItemTitle>Settings</DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            router.push(
              Platform.select({
                native: "/profile/edit",
                web: {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    editProfileModal: true,
                  },
                } as any,
              }),
              Platform.select({
                native: "/profile/edit",
                web: router.asPath,
              })
            );
          }}
          key="edit-profile"
        >
          <MenuItemIcon Icon={Edit} />
          <DropdownMenuItemTitle>Edit Profile</DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuRoot>
          <DropdownMenuTriggerItem key="nested-group-trigger">
            <MenuItemIcon Icon={isLightTheme ? Sun : Moon} />
            <DropdownMenuItemTitle>Theme</DropdownMenuItemTitle>
          </DropdownMenuTriggerItem>
          <DropdownMenuContent tw="w-30">
            <DropdownMenuItem
              onSelect={() => context.setColorScheme("light")}
              key="nested-group-1"
            >
              <MenuItemIcon Icon={Sun} />
              <DropdownMenuItemTitle>Light</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => context.setColorScheme("dark")}
              key="nested-group-2"
            >
              <MenuItemIcon Icon={Moon} />
              <DropdownMenuItemTitle>Dark</DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>

        <DropdownMenuItem destructive onSelect={logout} key="sign-out">
          <MenuItemIcon Icon={LogOut} />
          <DropdownMenuItemTitle>Sign Out</DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { HeaderDropdown };
