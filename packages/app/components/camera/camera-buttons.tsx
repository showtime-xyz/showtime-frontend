import Animated, {
  SlideInDown,
  SlideOutDown,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { useRouter } from "app/navigation/use-router";
import { ImagePickerButton } from "design-system/image-picker";
import { Flip, IconClose, IconCheck } from "design-system/icon";
import { Pressable } from "design-system/pressable-scale";
import { View } from "design-system/view";
import { CircularProgress } from "app/components/circular-progress";

type Props = {
  photos: { uri: string }[];
  setPhotos: (photos: { uri: string }[]) => void;
  canPop: boolean;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  takePhoto: () => void;
  cameraPosition: "front" | "back";
  setCameraPosition: (cameraPosition: "front" | "back") => void;
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
            tw="h-12 w-12 bg-gray-800 rounded-md justify-center items-center"
            onPress={() => {
              setPhotos([]);
              setIsLoading(false);
            }}
          >
            <IconClose color="white" width={15} height={15} />
          </Pressable>
        </Animated.View>
      ) : (
        <ImagePickerButton
          onPick={(photo) => {
            router.push("/camera/create");
          }}
          type="camera"
        />
      )}

      <View tw="h-[83px] w-[83px] justify-center items-center">
        <View tw="absolute">
          <View tw="w-20 h-20 rounded-full bg-white" />
        </View>

        <View tw="rounded-full border-4 border-black bg-black">
          <Pressable
            tw="w-[64px] h-[64px] rounded-full bg-white"
            onPress={takePhoto}
            disabled={!canPop && photos.length < 9}
          />
        </View>
      </View>

      {isLoading ? (
        <View tw="h-12 w-12 justify-center items-center">
          <View tw="absolute">
            <CircularProgress
              size={50}
              strokeWidth={1.5}
              progress={loading}
              showOverlay={false}
              strokeColor="black"
            />
          </View>

          <Pressable
            tw="h-12 w-12 bg-gray-800 rounded-full justify-center items-center"
            onPress={() => {
              router.push("/camera/create");
            }}
          >
            <IconCheck color="white" width={18} height={18} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          tw="h-12 w-12 bg-gray-800 rounded-full justify-center items-center"
          onPress={() =>
            setCameraPosition(cameraPosition === "front" ? "back" : "front")
          }
        >
          <Flip color="white" width={24} height={24} />
        </Pressable>
      )}
    </View>
  );
}
