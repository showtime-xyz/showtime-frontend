import { useCallback } from "react";
import { Platform } from "react-native";

import { useSnapshot } from "valtio";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Create } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useLogInPromise } from "app/lib/login-promise";

import { videoUploadStore } from "../../store/video-upload-store";

export const CreateIconMobileWeb = () => {
  const { loginPromise } = useLogInPromise();
  const { pickVideo, uploadProgress, isUploading, abortUpload } =
    useSnapshot(videoUploadStore);
  const router = useRouter();
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

  const uploadAction = useCallback(async () => {
    try {
      await loginPromise();
      if (isUploading) {
        abortUpload();
      } else {
        await pickVideo();
        redirectToComposerScreen();
      }
    } catch (e) {
      //console.error(e);
    }
  }, [
    abortUpload,
    isUploading,
    loginPromise,
    pickVideo,
    redirectToComposerScreen,
  ]);

  return (
    <View tw="cursor-pointer flex-col items-center justify-center text-center md:flex-row">
      <Pressable onPress={uploadAction}>
        <View tw="items-center">
          <Create
            width={isUploading ? 24 : 32}
            height={isUploading ? 24 : 32}
            isDark={isDark}
          />
          {isUploading && (
            <Text tw="w-14 pb-1 pt-1 text-center text-xs text-gray-500 dark:text-gray-200">
              {uploadProgress}%
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
};
