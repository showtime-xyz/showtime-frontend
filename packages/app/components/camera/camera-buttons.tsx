import React, { useCallback } from "react";
import { View } from "dripsy";
import Animated, {
  SlideInDown,
  SlideOutDown,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { useRouter } from "app/navigation/use-router";
import { ImagePickerButton } from "design-system/image-picker";
import { IconFlashBoltActive } from "design-system/icon/IconFlashBoltActive";
import { IconFlashBoltInactive } from "design-system/icon/IconFlashBoltInactive";
import { IconClose } from "design-system/icon/IconClose";
import { IconCheck } from "design-system/icon/IconCheck";
import { Pressable } from "design-system/pressable-scale";

type Props = {
  photos: { uri: string }[];
  setPhotos: (photos: { uri: string }[]) => void;
  isPopping: boolean;
  setIsPopping: (isPopping: boolean) => void;
  canPop: boolean;
  nbPop: Animated.SharedValue<number>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  flash: "auto" | "on" | "off";
  setFlash: (flash: "auto" | "on" | "off") => void;
  takePhoto: () => void;
};

export function CameraButtons({
  photos,
  setPhotos,
  isPopping,
  setIsPopping,
  canPop,
  nbPop,
  isLoading,
  setIsLoading,
  flash,
  setFlash,
  takePhoto,
}: Props) {
  const router = useRouter();

  const onFlashPressed = useCallback(() => {
    if (flash === "auto") setFlash("on");
    if (flash === "on") setFlash("off");
    if (flash === "off") setFlash("auto");
  }, [flash]);

  const progress = useDerivedValue(() => {
    return withTiming(nbPop.value * 0.111, { duration: 50 });
  });

  const loading = useDerivedValue(() => {
    return withTiming(isLoading ? 0 : 1, {
      duration: isPopping && isLoading ? 6000 : 0,
    });
  });

  return (
    <View
      sx={{
        paddingY: 32,
        paddingX: 24,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {isPopping ? (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{ zIndex: 1 }}
        >
          <Pressable
            style={{
              width: 45,
              height: 45,
              backgroundColor: "#252628",
              borderRadius: 45 / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setPhotos([]);
              nbPop.value = withTiming(0, { duration: 500 });
              setIsPopping(false);
              setIsLoading(false);
            }}
          >
            <IconClose color="white" width={15} height={15} />
          </Pressable>
        </Animated.View>
      ) : (
        <ImagePickerButton
          onPick={(photo) => {
            // navigation.navigate("Create", {
            //   photos: [...photos, photo],
            // });
            router.push("/camera/create");
          }}
          type="camera"
        />
      )}

      <View
        sx={{
          width: 83,
          height: 83,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pressable
          style={{
            width: 70,
            height: 70,
            borderRadius: 70 / 2,
            backgroundColor: "white",
          }}
          onPress={takePhoto}
          disabled={!canPop && photos.length < 9}
        />
      </View>

      {isPopping ? (
        <View
          sx={{
            width: 45,
            height: 45,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            style={{
              width: 45,
              height: 45,
              backgroundColor: "#252628",
              borderRadius: 45 / 2,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              // navigation.navigate("Create", {
              //   photos,
              // });
              router.push("/camera/create");
              nbPop.value = withTiming(0, { duration: 500 });
              setIsPopping(false);
            }}
          >
            <IconCheck color="white" width={18} height={18} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={{
            width: 45,
            height: 45,
            backgroundColor: flash === "on" ? "#ff6300" : "#252628",
            borderRadius: 45 / 2,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={onFlashPressed}
        >
          {flash === "off" ? (
            <IconFlashBoltInactive color="white" width={24} height={24} />
          ) : (
            <IconFlashBoltActive color="white" width={20} height={20} />
          )}
        </Pressable>
      )}
    </View>
  );
}
