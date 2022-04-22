import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import * as ImagePicker from "expo-image-picker";

type Props = {
  mediaTypes?: "image" | "video" | "all";
};

export type FilePickerResolveValue = {
  file: File | string;
  type?: "video" | "image";
};

export const useFilePicker = () => {
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    return () => {
      if (inputRef.current) {
        inputRef.current.remove();
      }
    };
  }, []);

  const pickFile = async ({ mediaTypes = "all" }: Props) => {
    return new Promise<FilePickerResolveValue>(async (resolve, reject) => {
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.hidden = true;
        input.multiple = false;
        let accepts = [];
        if (mediaTypes === "all") {
          accepts.push("image/*");
          accepts.push("video/*");
        } else if (mediaTypes === "image") {
          accepts.push("image/*");
        } else if (mediaTypes === "video") {
          accepts.push("video/*");
        }

        input.accept = accepts.join(",");

        input.onchange = (e: InputEvent) => {
          const file = (e.target as any).files[0];
          const fileType = file["type"].split("/")[0] as "image" | "video";
          resolve({ file: file, type: fileType });
          input.remove();
          inputRef.current = null;
        };
        document.body.appendChild(input);
        inputRef.current = input;
        input.click();
      } else {
        if (Platform.OS === "ios") {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }

        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:
              mediaTypes === "image"
                ? ImagePicker.MediaTypeOptions.Images
                : mediaTypes === "video"
                ? ImagePicker.MediaTypeOptions.Videos
                : ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: false,
            quality: 1,
          });

          if (result.cancelled) return;

          resolve({ file: result.uri, type: result.type });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return pickFile;
};
