import React from "react";
import { Pressable } from "dripsy";

import { IconEmptyUploadPreview } from "design-system/icon/IconEmptyUploadPreview";
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
      sx={
        type === "profilePhoto"
          ? {
              width: 80,
              height: 80,
              backgroundColor: "#1C1E1F",
              borderRadius: 80 / 2,
              justifyContent: "center",
              alignItems: "center",
            }
          : {
              width: 45,
              height: 45,
              backgroundColor: "#252628",
              borderRadius: 4,
              justifyContent: "center",
              alignItems: "center",
            }
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
