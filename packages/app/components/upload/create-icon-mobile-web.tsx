import { useCallback } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { useSnapshot } from "valtio";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Create } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { breakpoints } from "design-system/theme";

import { videoUploadStore } from "./video-upload-store";

export const CreateIconMobileWeb = () => {
  const { pickVideo, uploadProgress, isUploading } =
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
    <View tw="cursor-pointer flex-col items-center justify-center text-center md:flex-row">
      <Pressable
        onPress={async () => {
          await pickVideo();
          redirectToComposerScreen();
        }}
      >
        <Create width={32} height={32} isDark={isDark} />
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
      </Pressable>
    </View>
  );
};
