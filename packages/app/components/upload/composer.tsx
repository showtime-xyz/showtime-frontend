import { useSnapshot } from "valtio";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { TextInput } from "@showtime-xyz/universal.text-input";
import { View } from "@showtime-xyz/universal.view";

import VideoThumbnail from "./video-thumbnail";
import { videoUploadStore } from "./video-upload-store";

const UploadComposer = () => {
  const { videoPath } = useSnapshot(videoUploadStore);
  const isDark = useIsDarkMode();
  return (
    <View tw="flex-1 items-center justify-start p-4">
      <VideoThumbnail videoUri={videoPath?.uri} timeFrame={100} />
      <View tw="mt-8 w-full">
        <TextInput
          tw="h-36 w-full rounded-3xl bg-gray-200 p-4 text-black dark:bg-[#1B1B1B]  dark:text-white"
          placeholder="Write a caption..."
          placeholderTextColor={isDark ? "#9CA3AF" : "#9F9F9F"}
          textAlignVertical="top"
          textAlign="left"
          multiline
          maxLength={280}
        />
      </View>
    </View>
  );
};

export default UploadComposer;
