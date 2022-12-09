import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import * as ImagePicker from "expo-image-picker";

type Props = {
  mediaTypes?: "image" | "video" | "all";
  option?: ImagePicker.ImagePickerOptions;
};

export type FilePickerResolveValue = {
  file: File | string;
  type?: "video" | "image";
  size?: number;
};

export const useFilePicker = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (inputRef.current) {
        inputRef.current.remove();
      }
    };
  }, []);

  const pickFile = ({ mediaTypes = "all", option = {} }: Props) => {
    // eslint-disable-next-line no-async-promise-executor
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

        input.onchange = (e) => {
          const files = (e.target as HTMLInputElement)?.files;
          const file = files ? files[0] : ({} as File);
          const fileType = file["type"].split("/")[0] as "image" | "video";

          resolve({ file: file, type: fileType, size: file.size });
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
            ...option,
          });

          if (result.canceled) return;
          const file = result.assets[0];
          resolve({ file: file.uri, type: file.type, size: file.fileSize });
        } catch (error) {
          reject(error);
          console.error(error);
        }
      }
    });
  };

  return pickFile;
};
