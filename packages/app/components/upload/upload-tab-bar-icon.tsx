import { Platform } from "react-native";

import { useSnapshot } from "valtio";

import { Video } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { TabBarIconProps } from "app/navigation/tab-bar-icons";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";

import { videoUploadStore } from "./video-upload-store";

export const CreateTabBarIcon = ({ color }: TabBarIconProps) => {
  const { takeVideo, pickVideo, chooseVideo } = useSnapshot(videoUploadStore);
  const router = useRouter();

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
        <Video
          style={{ zIndex: 1 }}
          width={24}
          height={24}
          color={color ?? "black"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent loop sideOffset={8}>
        <DropdownMenuItem
          key="b_library"
          onSelect={async () => {
            await chooseVideo();
            redirectToComposerScreen();
          }}
        >
          <MenuItemIcon Icon={() => null} ios={{ name: "folder" }} />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Choose Video
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
        <DropdownMenuItem
          key="c_camera"
          onSelect={async () => {
            await takeVideo();
            redirectToComposerScreen();
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
            await pickVideo();
            redirectToComposerScreen();
          }}
        >
          <MenuItemIcon
            Icon={() => null}
            ios={{ name: "photo.on.rectangle" }}
          />
          <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
            Camera Roll
          </DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
