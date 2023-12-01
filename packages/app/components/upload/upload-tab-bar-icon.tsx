import { useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useSnapshot } from "valtio";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Close, Create, Gallery, Image } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "design-system/dropdown-menu";
import { breakpoints } from "design-system/theme";

import { videoUploadStore } from "./video-upload-store";

export const CreateTabBarIcon = () => {
  const { takeVideo, pickVideo, chooseVideo, uploadProgress, isUploading } =
    useSnapshot(videoUploadStore);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const isDark = useIsDarkMode();

  const redirectToComposerScreen = useCallback(() => {
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
  }, [router]);

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <View tw="cursor-pointer flex-col items-center justify-center text-center md:flex-row">
          <Create
            style={{ zIndex: 1 }}
            width={34}
            height={34}
            isDark={isDark}
          />
          {isMdWidth ? (
            <View tw="ml-2 gap-1">
              <Text tw="font-bold">Create</Text>
              {isUploading && (
                <Text tw="text-xs text-gray-500 dark:text-gray-400">
                  {uploadProgress}%
                </Text>
              )}
            </View>
          ) : (
            isUploading && (
              <Text tw="text-xs text-gray-500 dark:text-gray-200">
                {uploadProgress}%
              </Text>
            )
          )}
        </View>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align={isMdWidth ? "start" : "center"}
        sideOffset={10}
        loop
      >
        {isUploading ? (
          <DropdownMenuItem
            key="b_library"
            onSelect={async () => {
              videoUploadStore.uploadInstance.abort();
              videoUploadStore.uploadProgress = 0;
              videoUploadStore.isUploading = false;
            }}
            destructive
          >
            <DropdownMenuItemTitle tw="text-gray-700 dark:text-neutral-300">
              Abort upload
            </DropdownMenuItemTitle>
            <MenuItemIcon
              Icon={() => <Close height={20} width={20} color={"black"} />}
              ios={{ name: "arrowshape.bounce.right" }}
            />
          </DropdownMenuItem>
        ) : (
          <>
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
                Photo Library
              </DropdownMenuItemTitle>
              <MenuItemIcon
                Icon={() => <Gallery height={20} width={20} color={"black"} />}
                ios={{ name: "photo.on.rectangle" }}
              />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
};
