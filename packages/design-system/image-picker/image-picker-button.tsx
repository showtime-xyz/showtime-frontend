import {
  FilePickerResolveValue,
  useFilePicker,
} from "design-system/file-picker";
import { Image } from "design-system/icon";
import { Pressable } from "design-system/pressable-scale";
import { tw } from "design-system/tailwind";

export function ImagePickerButton({
  onPick,
  type,
}: {
  onPick: (param: FilePickerResolveValue) => void;
  type: "camera" | "profilePhoto" | "button";
}) {
  const pickFile = useFilePicker();

  // TODO: show first picture available in image gallery if permissions are OK and is type camera
  return (
    <Pressable
      tw={
        type === "profilePhoto"
          ? "w-20 h-20 bg-white dark:bg-black rounded-full justify-center items-center"
          : "w-12 h-12 bg-white dark:bg-black rounded-full justify-center items-center"
      }
      onPress={async () => {
        const file = await pickFile({ mediaTypes: "image" });
        onPick(file);
      }}
    >
      {/* {type === "profilePhoto" && currentUser?.profile_photo_url && (
        <View sx={{ position: "absolute" }}>
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
      <Image
        color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
        width={24}
        height={24}
      />
    </Pressable>
  );
}
