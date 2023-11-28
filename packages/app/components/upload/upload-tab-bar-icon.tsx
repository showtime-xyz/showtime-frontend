import { Platform, useWindowDimensions } from "react-native";

import { useSnapshot } from "valtio";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Create, Gallery, Image, Video } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { TabBarIconProps } from "app/navigation/tab-bar-icons";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import { breakpoints } from "design-system/theme";

import { videoUploadStore } from "./video-upload-store";

export const CreateTabBarIcon = ({ color }: TabBarIconProps) => {
  const { takeVideo, pickVideo, chooseVideo } = useSnapshot(videoUploadStore);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const isDark = useIsDarkMode();

  const redirectToComposerScreen = () => {
    const as = "/upload/composer";
    router.push(
      Platform.select({
        native: as,
        web: {
          pathname: router.pathname,
          query: {
            ...router.query,
            uploadComposerModal: true,
          },
        } as any,
      }),
      Platform.select({ native: as, web: router.asPath }),
      {
        shallow: true,
      }
    );
  };

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <View tw="cursor-pointer flex-row items-center justify-center text-center">
          <Create
            style={{ zIndex: 1 }}
            width={34}
            height={34}
            color={color ?? "black"}
            isDark={isDark}
          />
          {isMdWidth && (
            <View tw="ml-2">
              <Text tw="font-bold">Create</Text>
            </View>
          )}
        </View>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align={isMdWidth ? "start" : "center"}
        sideOffset={10}
        loop
      >
        <DropdownMenuItem
          key="b_library"
          onSelect={async () => {
            const success = await chooseVideo();
            if (success) redirectToComposerScreen();
          }}
        >
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Choose Video
          </DropdownMenuItemTitle>
          <MenuItemIcon
            Icon={() => <Image height={20} width={20} color={"black"} />}
            ios={{ name: "folder" }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          key="c_camera"
          onSelect={async () => {
            const success = await takeVideo();
            if (success) redirectToComposerScreen();
          }}
        >
          <MenuItemIcon Icon={() => null} ios={{ name: "camera" }} />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Take Video
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
        <DropdownMenuItem
          key="a_roll"
          onSelect={async () => {
            const success = await pickVideo();
            if (success) redirectToComposerScreen();
          }}
        >
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Camera Roll
          </DropdownMenuItemTitle>
          <MenuItemIcon
            Icon={() => <Gallery height={20} width={20} color={"black"} />}
            ios={{ name: "photo.on.rectangle" }}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
