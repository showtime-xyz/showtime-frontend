import { useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { useColorScheme } from "@showtime-xyz/universal.color-scheme";
import {
  User,
  Settings,
  Edit,
  Moon,
  Sun,
  LogOut,
  DarkMode,
  Download3,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { useAuth } from "app/hooks/auth/use-auth";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { downloadCollectorList } from "app/hooks/use-download-collector-list";
import { useUser } from "app/hooks/use-user";
import { Profile } from "app/types";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "design-system/dropdown-menu";
import { breakpoints } from "design-system/theme";

type HeaderDropdownProps = {
  type: "profile" | "settings";
  withBackground?: boolean;
  user?: Profile;
};
function HeaderDropdown({
  type,
  withBackground = false,
  user,
}: HeaderDropdownProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { user: currentUser, isAuthenticated } = useUser();
  const { userAddress } = useCurrentUserAddress();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isMdWidth = width >= breakpoints["md"];
  const isDark = colorScheme === "dark";
  const walletAddressMatch = useMemo(
    () =>
      user?.wallet_addresses_v2?.some(
        (wallet) => wallet.address === userAddress
      ),
    [user?.wallet_addresses_v2, userAddress]
  );

  // If the user is not authenticated, don't show the dropdown
  if (!isAuthenticated) return null;

  // If the user is on a profile page, and the currentUser is not the same as the passed user,
  // don't show the dropdown menu (only show it on your own profile page)
  if (
    currentUser?.data.profile.username !== user?.username &&
    !walletAddressMatch
  )
    return null;

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        {type === "profile" ? (
          <View tw="flex h-12 cursor-pointer flex-row items-center justify-center rounded-full bg-gray-100 px-2 dark:bg-gray-900">
            <Avatar alt="Avatar" url={user?.img_url} />
            {isWeb && isMdWidth && user?.username ? (
              <Text tw="ml-2 mr-1 font-semibold dark:text-white ">
                {`@${user.username}`}
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

      <DropdownMenuContent loop sideOffset={12}>
        {type === "profile" && (
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/@${user?.username ?? userAddress}`);
            }}
            key="your-profile"
          >
            <MenuItemIcon Icon={User} />
            <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
              Profile
            </DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onSelect={() => router.push("/settings")}
          key="your-settings"
        >
          <MenuItemIcon
            Icon={Settings}
            ios={{
              name: "gear",
            }}
          />

          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
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
          <MenuItemIcon
            Icon={Edit}
            ios={{
              name: "square.and.pencil",
            }}
          />

          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Edit Profile
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            downloadCollectorList();
          }}
          key="download-collector-list"
        >
          <MenuItemIcon
            Icon={Download3}
            ios={{
              name: "arrow.down.doc",
            }}
          />

          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Download collector list
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger key="nested-group-trigger">
            <MenuItemIcon
              Icon={isDark ? Moon : Sun}
              ios={{
                name: isDark ? "moon" : "sun.max",
              }}
            />

            <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
              Theme
            </DropdownMenuItemTitle>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onSelect={() => setColorScheme("light")}
              key="nested-group-1"
            >
              <MenuItemIcon Icon={Sun} ios={{ name: "sun.max" }} />
              <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
                Light
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setColorScheme("dark")}
              key="nested-group-2"
            >
              <MenuItemIcon Icon={Moon} ios={{ name: "moon" }} />
              <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
                Dark
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setColorScheme(null)}
              key="nested-group-3"
            >
              <MenuItemIcon
                Icon={DarkMode}
                ios={{
                  name: "circle.righthalf.filled",
                }}
              />
              <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
                System
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem destructive onSelect={logout} key="sign-out">
          <MenuItemIcon
            Icon={LogOut}
            ios={{ name: "rectangle.portrait.and.arrow.right" }}
          />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Sign Out
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { HeaderDropdown };
