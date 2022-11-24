import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { Flip, Close, Check } from "@showtime-xyz/universal.icon";
import { PressableScale } from "@showtime-xyz/universal.pressable-scale";
import { View } from "@showtime-xyz/universal.view";

import { FilePickerResolveValue } from "app/lib/file-picker";
import { ImagePickerButton } from "app/lib/image-picker";

type Props = {
  photos: { uri: string }[];
  setPhotos: (photos: { uri: string }[]) => void;
  canPop: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  takePhoto: () => void;
  cameraPosition: "front" | "back";
  setCameraPosition: (cameraPosition: "front" | "back") => void;
  postPhoto: (param: FilePickerResolveValue) => void;
};

export function CameraButtons({
  photos,
  setPhotos,
  canPop,
  isLoading,
  setIsLoading,
  takePhoto,
  cameraPosition,
  setCameraPosition,
  postPhoto,
}: Props) {
  const isDark = useIsDarkMode();

  return (
    <View tw="flex-row items-center justify-between py-8 px-6">
      {isLoading ? (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{ zIndex: 1 }}
        >
          <PressableScale
            style={{
              height: 48,
              width: 48,
              borderRadius: 9999,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isDark ? "#000" : "#FFF",
            }}
            onPress={() => {
              setPhotos([]);
              setIsLoading(false);
            }}
          >
            <Close color={isDark ? "#FFF" : "#000"} width={24} height={24} />
          </PressableScale>
        </Animated.View>
      ) : (
        <ImagePickerButton
          onPick={(photo) => {
            postPhoto(photo);
          }}
          type="camera"
        />
      )}

      <View tw="h-[83px] w-[83px] items-center justify-center">
        <View tw="absolute">
          <View tw="h-20 w-20 rounded-full bg-black dark:bg-white" />
        </View>

        <View tw="rounded-full border-4 border-white bg-white dark:border-black dark:bg-black">
          <PressableScale
            style={{
              height: 64,
              width: 64,
              borderRadius: 9999,
              backgroundColor: isDark ? "#000" : "#FFF",
            }}
            onPress={takePhoto}
            disabled={!canPop && photos.length < 9}
          />
        </View>
      </View>

      {isLoading ? (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{ zIndex: 1 }}
        >
          <View tw="h-12 w-12 items-center justify-center">
            {/* <View tw="absolute">
              <CircularProgress
                size={50}
                strokeWidth={1.5}
                progress={loading}
                showOverlay={false}
                strokeColor="black"
              />
            </View> */}

            <PressableScale
              style={{
                zIndex: 10,
                height: 48,
                width: 48,
                borderRadius: 9999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDark ? "#000" : "#FFF",
              }}
              onPress={() => {
                postPhoto({ file: photos[0].uri, type: "image" });
              }}
            >
              <Check color={isDark ? "#FFF" : "#000"} width={24} height={24} />
            </PressableScale>
          </View>
        </Animated.View>
      ) : (
        <PressableScale
          style={{
            height: 48,
            width: 48,
            borderRadius: 9999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark ? "#000" : "#FFF",
          }}
          onPress={() =>
            setCameraPosition(cameraPosition === "front" ? "back" : "front")
          }
        >
          <Flip color={isDark ? "#FFF" : "#000"} width={24} height={24} />
        </PressableScale>
      )}
    </View>
  );
}
