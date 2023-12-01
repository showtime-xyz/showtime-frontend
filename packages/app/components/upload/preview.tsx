import { useSnapshot } from "valtio";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { videoUploadStore } from "./store/video-upload-store";

const UploadPreview = () => {
  const { videoPath } = useSnapshot(videoUploadStore);
  console.log(videoPath);
  return (
    <View tw="flex-1 items-center justify-center">
      <Text tw="text-white">Preview</Text>
    </View>
  );
};

export default UploadPreview;
