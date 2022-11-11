import { Platform, useWindowDimensions } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItemNativeIcon,
} from "@showtime-xyz/universal.dropdown-menu";
import {
  User,
  Settings,
  Edit,
  Moon,
  Sun,
  LogOut,
  DarkMode,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { useAuth } from "app/hooks/auth/use-auth";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";

import { breakpoints } from "design-system/theme";

type HeaderDropdownProps = {
  type: "profile" | "settings";
  withBackground?: boolean;
};
function HeaderDropdown({ type, withBackground = false }: HeaderDropdownProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { user } = useUser();
  const { userAddress } = useCurrentUserAddress();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isMdWidth = width >= breakpoints["md"];
  const isDark = colorScheme === "dark";

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        {type === "profile" ? (
          <View tw="flex h-12 cursor-pointer flex-row items-center justify-center rounded-full bg-gray-100 px-2 dark:bg-gray-900">
            <Avatar alt="Avatar" url={user?.data?.profile?.img_url} />
            {isWeb && isMdWidth && user?.data?.profile?.username ? (
              <Text tw="ml-2 mr-1 font-semibold dark:text-white ">
                {`@${user.data.profile.username}`}
              </Text>
            ) : null}
          </View>
        ) : (
          <View
            tw={[
              "h-8 w-8 items-center justify-center rounded-full",
              withBackground ? "bg-black/60" : "",
            ]}
          >
            <Settings
              width={24}
              height={24}
              color={withBackground ? "#FFF" : isDark ? "#FFF" : "#000"}
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
            <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
              Profile
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onSelect={() => router.push("/settings")}
          key="your-settings"
        >
          <MenuItemIcon Icon={Settings} />
          <DropdownMenuItemNativeIcon iosIconName="gear" />

          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
            Settings
          </DropdownMenuItemTitle>
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
          <DropdownMenuItemNativeIcon iosIconName="square.and.pencil" />

          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
            Edit Profile
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger key="nested-group-trigger">
            <MenuItemIcon Icon={isDark ? Moon : Sun} />
            <DropdownMenuItemNativeIcon
              iosIconName={isDark ? "moon" : "sun.max"}
            />

            <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
              Theme
            </DropdownMenuItemTitle>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent tw="w-30">
            <DropdownMenuItem
              onSelect={() => setColorScheme("light")}
              key="nested-group-1"
            >
              <MenuItemIcon Icon={Sun} />
              <DropdownMenuItemNativeIcon iosIconName="sun.max" />
              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Light
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setColorScheme("dark")}
              key="nested-group-2"
            >
              <MenuItemIcon Icon={Moon} />
              <DropdownMenuItemNativeIcon iosIconName="moon" />
              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                Dark
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setColorScheme(null)}
              key="nested-group-3"
            >
              <MenuItemIcon Icon={DarkMode} />
              <DropdownMenuItemNativeIcon iosIconName="circle.righthalf.filled" />
              <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
                System
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem destructive onSelect={logout} key="sign-out">
          <MenuItemIcon Icon={LogOut} />
          <DropdownMenuItemNativeIcon iosIconName="rectangle.portrait.and.arrow.right" />

          <DropdownMenuItemTitle tw="font-semibold text-gray-700 dark:text-neutral-300">
            Sign Out
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { HeaderDropdown };
