import Animated, {
  SlideInDown,
  SlideOutDown,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { CircularProgress } from "app/components/circular-progress";
import { useRouter } from "app/navigation/use-router";

import { Flip, Close, Check } from "design-system/icon";
import { ImagePickerButton } from "design-system/image-picker";
import { Pressable } from "design-system/pressable-scale";
import { tw } from "design-system/tailwind";
import { View } from "design-system/view";

type Props = {
  photos: { uri: string }[];
  setPhotos: (photos: { uri: string }[]) => void;
  canPop: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  takePhoto: () => void;
  cameraPosition: "front" | "back";
  setCameraPosition: (cameraPosition: "front" | "back") => void;
  postPhoto: (param?: File | string) => void;
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
  const router = useRouter();

  const loading = useDerivedValue(() => {
    return withTiming(isLoading ? 0 : 1, {
      duration: isLoading ? 6000 : 0,
    });
  });

  return (
    <View tw="py-8 px-6 justify-between items-center flex-row">
      {isLoading ? (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{ zIndex: 1 }}
        >
          <Pressable
            tw="h-12 w-12 bg-white dark:bg-black rounded-full justify-center items-center"
            onPress={() => {
              setPhotos([]);
              setIsLoading(false);
            }}
          >
            <Close
              color={
                tw.style("bg-black dark:bg-white")?.backgroundColor as string
              }
              width={24}
              height={24}
            />
          </Pressable>
        </Animated.View>
      ) : (
        <ImagePickerButton
          onPick={(photo) => {
            postPhoto(photo.file ? photo.file : photo.uri);
          }}
          type="camera"
        />
      )}

      <View tw="h-[83px] w-[83px] justify-center items-center">
        <View tw="absolute">
          <View tw="w-20 h-20 rounded-full bg-black dark:bg-white" />
        </View>

        <View tw="rounded-full border-4 border-white dark:border-black bg-white dark:bg-black">
          <Pressable
            tw="w-[64px] h-[64px] rounded-full bg-black dark:bg-white"
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
          <View tw="h-12 w-12 justify-center items-center">
            {/* <View tw="absolute">
              <CircularProgress
                size={50}
                strokeWidth={1.5}
                progress={loading}
                showOverlay={false}
                strokeColor="black"
              />
            </View> */}

            <Pressable
              tw="h-12 w-12 bg-white dark:bg-black rounded-full justify-center items-center z-10"
              onPress={() => {
                postPhoto(photos[0].uri);
              }}
            >
              <Check
                color={
                  tw.style("bg-black dark:bg-white")?.backgroundColor as string
                }
                width={24}
                height={24}
              />
            </Pressable>
          </View>
        </Animated.View>
      ) : (
        <Pressable
          tw="h-12 w-12 bg-white dark:bg-black rounded-full justify-center items-center"
          onPress={() =>
            setCameraPosition(cameraPosition === "front" ? "back" : "front")
          }
        >
          <Flip
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
            width={24}
            height={24}
          />
        </Pressable>
      )}
    </View>
  );
}
