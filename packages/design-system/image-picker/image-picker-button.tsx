import { Pressable } from "design-system/pressable-scale";
import { IconEmptyUploadPreview } from "design-system/icon";
import { pickImage } from "./pick-image";

export function ImagePickerButton({
  onPick,
  type,
}: {
  onPick: (attachment: any) => void;
  type: "camera" | "profilePhoto" | "button";
}) {
  // if (type === "button") {
  //   return (
  //     <Button
  //       onPress={() => {
  //         pickImage({
  //           onPick,
  //         });
  //       }}
  //     />
  //   );
  // }

  // TODO: show first picture available in image gallery if permissions are OK and is type camera
  return (
    <Pressable
      tw={
        type === "profilePhoto"
          ? "w-20 h-20 bg-gray-800 rounded-full justify-center items-center"
          : "w-12 h-12 bg-gray-800 rounded-md justify-center items-center"
      }
      onPress={() => {
        pickImage({
          onPick,
        });
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

      <IconEmptyUploadPreview color="white" width={25} height={25} />
    </Pressable>
  );
}
