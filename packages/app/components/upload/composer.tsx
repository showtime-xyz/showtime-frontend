import { useCallback, useState, useLayoutEffect } from "react";
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

import { toast } from "design-system/toast";

import VideoThumbnail from "./video-thumbnail";
import { videoUploadStore } from "./video-upload-store";

const PlatformSafeView = Platform.OS === "web" ? View : SafeAreaView;

const UploadComposer = () => {
  const router = useRouter();
  const [previewImg, setPreviewImg] = useState<string | undefined>(undefined);
  const { videoPath, signUpload } = useSnapshot(videoUploadStore);
  const [text, setText] = useState<string>("");
  const isDark = useIsDarkMode();
  const close = useCallback(() => {
    router.pop();
  }, [router]);

  // we need to delay this because otherwise it will block the UI
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      setPreviewImg(videoPath?.uri);
    });
  }, [videoPath?.uri]);

  const renderEndComponent = useCallback(() => {
    return (
      <Pressable
        onPress={async () => {
          close();
          toast.success("Upload queued", {
            duration: 2000,
          });
          signUpload({ data: { description: text }, router });
        }}
        disabled={!videoPath?.uri}
      >
        <View
          tw="absolute -top-4 right-0 flex-row items-center justify-center rounded-full bg-[#FF3370] px-8 py-2"
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
  }, [videoPath?.uri, close, signUpload, text, router]);

  return (
    <PlatformSafeView>
      <View>
        <ModalHeader onClose={close} endContentComponent={renderEndComponent} />
        <View tw="flex-1 items-center justify-start p-4">
          <VideoThumbnail videoUri={previewImg} timeFrame={100} />
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
                value={text}
                onChangeText={setText}
              />
            </View>
          </View>
        </View>
      </View>
    </PlatformSafeView>
  );
};

export default UploadComposer;
