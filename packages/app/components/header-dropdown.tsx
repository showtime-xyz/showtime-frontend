import { useContext } from "react";

import { AppContext } from "app/context/app-context";
import { useAuth } from "app/hooks/auth/use-auth";
import { useUser } from "app/hooks/use-user";
import { DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { formatAddressShort } from "app/lib/utilities";
import {
  useProfileNavigation,
  useSettingsNavigation,
} from "app/navigation/app-navigation";

import { View, Image } from "design-system";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuTriggerItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "design-system/dropdown-menu";

const getSmallImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s64";
  }
  return imgUrl;
};

function HeaderDropdown() {
  const { user } = useUser();
  const { logout } = useAuth();
  const context = useContext(AppContext);
  const openProfile = useProfileNavigation(
    user?.data?.profile?.wallet_addresses_v2?.[0]?.address
  );
  const openSettings = useSettingsNavigation(
    user?.data?.profile?.wallet_addresses_v2?.[0]?.address
  );

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <View tw="h-8 w-8 items-center justify-center rounded-full">
          <Image
            tw="h-8 w-8 rounded-full"
            source={{
              uri: getSmallImageUrl(
                user?.data.profile?.img_url || DEFAULT_PROFILE_PIC
              ),
            }}
            alt={
              user?.data?.profile?.name ||
              user?.data?.profile?.username ||
              user?.data?.profile?.wallet_addresses_excluding_email_v2?.[0]
                ?.ens_domain ||
              formatAddressShort(
                user?.data?.profile?.wallet_addresses_excluding_email_v2?.[0]
                  ?.address
              ) ||
              "Profile"
            }
          />
        </View>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        loop
        tw="w-60 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow"
      >
        <DropdownMenuItem
          onSelect={openProfile}
          key="your-profile"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Profile
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuRoot>
          <DropdownMenuTriggerItem
            key="nested-group-trigger"
            tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
          >
            <DropdownMenuItemTitle tw="text-black dark:text-white">
              Theme
            </DropdownMenuItemTitle>
          </DropdownMenuTriggerItem>
          <DropdownMenuContent tw="w-30 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow">
            <DropdownMenuItem
              onSelect={() => context.setColorScheme("light")}
              key="nested-group-1"
              tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
            >
              <DropdownMenuItemTitle tw="text-black dark:text-white">
                Light
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => context.setColorScheme("dark")}
              key="nested-group-2"
              tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
            >
              <DropdownMenuItemTitle tw="text-black dark:text-white">
                Dark
              </DropdownMenuItemTitle>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          onSelect={openSettings}
          key="your-settings"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
        >
          <DropdownMenuItemTitle tw="text-black dark:text-white">
            Settings
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuSeparator tw="h-[1px] m-1 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          destructive
          onSelect={logout}
          key="sign-out"
          tw="h-8 rounded-sm overflow-hidden flex-1 p-2"
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
