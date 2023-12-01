import { useCallback, useState } from "react";
import { Platform } from "react-native";

import * as Tooltip from "universal-tooltip";
import { useSnapshot } from "valtio";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Create } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import Spinner from "@showtime-xyz/universal.spinner";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { colors } from "design-system/tailwind/colors";

import { videoUploadStore } from "./video-upload-store";

export const CreateButtonDesktop = () => {
  const { chooseVideo, uploadProgress, isUploading, abortUpload } =
    useSnapshot(videoUploadStore);
  const router = useRouter();
  const isDark = useIsDarkMode();
  const [isPreparing, setIsPreparing] = useState(false);

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
    <Tooltip.Root delayDuration={0} open={isPreparing ? false : undefined}>
      <Tooltip.Trigger>
        <Pressable
          tw="w-full flex-row items-center justify-center rounded-full bg-[#FF3370] p-2 transition-transform duration-300 hover:scale-105"
          onPress={async () => {
            if (isUploading) {
              abortUpload();
            } else {
              const success = await chooseVideo();
              if (success) {
                setIsPreparing(true);
                redirectToComposerScreen();
                setTimeout(() => {
                  setIsPreparing(false);
                }, 1500);
              }
            }
          }}
          disabled={isPreparing}
        >
          {isPreparing ? (
            <View tw="scale-90">
              <Spinner size="small" color="black" />
            </View>
          ) : (
            <Create
              width={24}
              height={24}
              color={"white"}
              crossColor={"#FF3370"}
            />
          )}
          <View tw="ml-2 gap-1">
            <Text tw="font-semibold text-white">
              {isUploading ? "Upload..." : "Create"}
            </Text>
            {isUploading && (
              <Text tw="-mt-1 text-[10px] text-white">{uploadProgress}%</Text>
            )}
          </View>
        </Pressable>
      </Tooltip.Trigger>
      <Tooltip.Content
        sideOffset={4}
        containerStyle={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          paddingBottom: 8,
        }}
        className="web:outline-none"
        side="top"
        presetAnimation="fadeIn"
        backgroundColor={isDark ? "#fff" : colors.gray[900]}
        borderRadius={12}
      >
        <Tooltip.Text
          text={
            isUploading ? "Click to\nabort upload" : "Select a video\nto upload"
          }
          style={{
            textAlign: "center",
            color: isDark ? colors.gray[900] : "#fff",
          }}
        />
        <Tooltip.Arrow width={12} height={6} />
      </Tooltip.Content>
    </Tooltip.Root>
  );
};
