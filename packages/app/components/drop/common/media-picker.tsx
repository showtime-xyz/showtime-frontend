import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { FlipIcon, Image as ImageIcon } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Preview } from "app/components/preview";
import { DropFileZone } from "app/lib/drop-file-zone";
import { FilePickerResolveValue, useFilePicker } from "app/lib/file-picker";

type MediaPickerProps = {
  value?: File | string | null;
  onChange: (fileObj: FilePickerResolveValue) => void;
  disabled?: boolean;
  errorMessage?: string;
  size: number;
};

export const MediaPicker = (props: MediaPickerProps) => {
  const { disabled, onChange, value, errorMessage, size } = props;
  const pickFile = useFilePicker();
  const isDark = useIsDarkMode();

  return (
    <DropFileZone onChange={onChange} disabled={disabled}>
      <View tw="z-1">
        <Pressable
          tw={`items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 ${
            disabled ? "opacity-40" : ""
          }`}
          style={{ height: size, width: size }}
          disabled={disabled}
          onPress={async () => {
            const file = await pickFile({
              mediaTypes: "all",
            });

            onChange(file);
          }}
        >
          {value ? (
            <View tw="w-full">
              <Preview
                file={value}
                style={previewBorderStyle}
                width={size}
                height={size}
              />
              <View tw="absolute h-full w-full items-center justify-center">
                <View tw="flex-row items-center shadow-lg">
                  <FlipIcon width={20} height={20} color="white" />
                  <Text tw="ml-2 text-sm text-white">Replace</Text>
                </View>
              </View>
            </View>
          ) : (
            <View tw="w-full flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-gray-800 dark:border-gray-200">
              <ImageIcon
                color={isDark ? "#FFF" : "#000"}
                width={40}
                height={40}
              />
              {errorMessage ? (
                <View tw="mt-2">
                  <Text tw="text-center text-sm text-red-500">
                    {errorMessage as string}
                  </Text>
                </View>
              ) : null}

              <View tw="mt-2">
                <Text tw="px-4 text-center text-gray-600 dark:text-gray-200">
                  {`Tap to upload a JPG, PNG, GIF, WebM or MP4 file.\nMax file size: 30MB`}
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    </DropFileZone>
  );
};

const previewBorderStyle = {
  borderRadius: 16,
};
