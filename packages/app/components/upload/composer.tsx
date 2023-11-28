import { useCallback } from "react";
import { Platform } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ArrowTop } from "@showtime-xyz/universal.icon";
import { ModalHeader } from "@showtime-xyz/universal.modal";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { TextInput } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

import VideoThumbnail from "./video-thumbnail";
import { videoUploadStore } from "./video-upload-store";

const PlatformSafeView = Platform.OS === "web" ? View : SafeAreaView;

const UploadComposer = () => {
  const router = useRouter();
  const { videoPath, signUpload } = useSnapshot(videoUploadStore);
  const isDark = useIsDarkMode();
  const close = useCallback(() => {
    router.pop();
  }, [router]);

  const renderEndComponent = useCallback(() => {
    return (
      <Pressable onPress={signUpload}>
        <View
          tw="absolute right-3 flex-row items-center justify-center rounded-full bg-[#FF3370] px-8 py-2"
          style={{
            opacity: videoPath?.uri ? 1 : 0.5,
          }}
        >
          <Text tw="font-bold text-white">Post</Text>
          <View tw="ml-1">
            <ArrowTop width={18} height={18} color={"white"} stroke={"white"} />
          </View>
        </View>
      </Pressable>
    );
  }, [videoPath?.uri, signUpload]);

  return (
    <PlatformSafeView>
      <View>
        <ModalHeader onClose={close} endContentComponent={renderEndComponent} />
        <View tw="flex-1 items-center justify-start p-4">
          <VideoThumbnail videoUri={videoPath?.uri} timeFrame={100} />
          <View tw="mt-8 w-full">
            <View tw="h-28 w-full overflow-hidden rounded-3xl bg-gray-200 p-4 text-base  text-black dark:bg-[#1B1B1B] dark:text-white">
              <TextInput
                tw="h-24 w-full text-base text-black dark:text-white"
                placeholder="Write a caption..."
                placeholderTextColor={isDark ? "#737373" : "#9F9F9F"}
                textAlignVertical="top"
                textAlign="left"
                multiline
                maxLength={280}
                style={{ lineHeight: 20 }}
              />
            </View>
          </View>
        </View>
      </View>
    </PlatformSafeView>
  );
};

export default UploadComposer;
