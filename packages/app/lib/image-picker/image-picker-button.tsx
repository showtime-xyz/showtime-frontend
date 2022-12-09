import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Image } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";

import { FilePickerResolveValue, useFilePicker } from "app/lib/file-picker";

export function ImagePickerButton({
  onPick,
  type,
}: {
  onPick: (param: FilePickerResolveValue) => void;
  type: "camera" | "profilePhoto" | "button";
}) {
  const isDark = useIsDarkMode();
  const pickFile = useFilePicker();

  // TODO: show first picture available in image gallery if permissions are OK and is type camera
  return (
    <PressableScale
      style={{
        height: type === "profilePhoto" ? 80 : 48,
        width: type === "profilePhoto" ? 80 : 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9999,
        backgroundColor: isDark ? "#000" : "#fff",
      }}
      onPress={async () => {
        const file = await pickFile({ mediaTypes: "image" });
        onPick(file);
      }}
    >
      {/* {type === "profilePhoto" && currentUser?.profile_photo_url && (
        <View style={{ position: "absolute" }}>
          <Image
            source={{
              uri: currentUser.profile_photo_url,
            }}
            width={80}
            height={80}
            style={{
              borderRadius: 50,
            }}
          />
        </View>
      )}*/}
      <Image color={isDark ? "#fff" : "#000"} width={24} height={24} />
    </PressableScale>
  );
}
