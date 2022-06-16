import { useContext } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { AppContext } from "app/context/app-context";
import { useAuth } from "app/hooks/auth/use-auth";
import { useCurrentUserAddress } from "app/hooks/use-current-user-address";
import { useUser } from "app/hooks/use-user";
import { useRouter } from "app/navigation/use-router";

import { Avatar } from "design-system/avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuTriggerItem,
} from "design-system/dropdown-menu";
import { Settings } from "design-system/icon";
import { tw } from "design-system/tailwind";
import { Text } from "design-system/text";
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
          <View tw="rounded-ful flex h-12 cursor-pointer flex-row items-center justify-center">
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

      <DropdownMenuContent loop>
        {type === "profile" && (
          <DropdownMenuItem
            onSelect={() => {
              router.push(`/@${user?.data?.profile?.username ?? userAddress}`);
            }}
            key="your-profile"
          >
            <DropdownMenuItemTitle>Profile</DropdownMenuItemTitle>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onSelect={() => router.push("/settings")}
          key="your-settings"
        >
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
          <DropdownMenuItemTitle>Edit profile</DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuRoot>
          <DropdownMenuTriggerItem key="nested-group-trigger">
            <DropdownMenuItemTitle>Theme</DropdownMenuItemTitle>
          </DropdownMenuTriggerItem>
          <DropdownMenuContent tw="w-30">
            <DropdownMenuItem
              onSelect={() => context.setColorScheme("light")}
              key="nested-group-1"
            >
              <DropdownMenuItemTitle>Light</DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => context.setColorScheme("dark")}
              key="nested-group-2"
            >
              <DropdownMenuItemTitle>Dark</DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>

        <DropdownMenuItem destructive onSelect={logout} key="sign-out">
          <DropdownMenuItemTitle>Sign Out</DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { HeaderDropdown };
