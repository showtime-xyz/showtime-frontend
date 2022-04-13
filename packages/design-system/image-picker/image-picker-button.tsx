import { useRef } from "react";
import { Platform } from "react-native";

import { Image } from "design-system/icon";
import { Pressable } from "design-system/pressable-scale";
import { tw } from "design-system/tailwind";

import { pickImage } from "./pick-image";

export function ImagePickerButton({
  onPick,
  type,
}: {
  onPick: (attachment: { file?: File; uri?: string }) => void;
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

  const filePickerRef = useRef();

  // TODO: show first picture available in image gallery if permissions are OK and is type camera
  return (
    <Pressable
      tw={
        type === "profilePhoto"
          ? "w-20 h-20 bg-white dark:bg-black rounded-full justify-center items-center"
          : "w-12 h-12 bg-white dark:bg-black rounded-full justify-center items-center"
      }
      onPress={() => {
        if (Platform.OS !== "web") {
          pickImage({
            onPick,
          });
        } else {
          //@ts-ignore
          filePickerRef.current.click();
        }
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

      {Platform.OS === "web" ? (
        <input
          type="file"
          hidden
          //@ts-ignore
          ref={filePickerRef}
          multiple={false}
          onChange={(e) => {
            //@ts-ignore
            onPick({ file: e.target.files[0] });
          }}
        />
      ) : null}

      <Image
        color={tw.style("bg-black dark:bg-white")?.backgroundColor as string}
        width={24}
        height={24}
      />
    </Pressable>
  );
}
