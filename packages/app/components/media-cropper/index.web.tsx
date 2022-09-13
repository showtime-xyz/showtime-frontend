import { useState, useCallback } from "react";
import { Modal } from "react-native";

import Slider from "@react-native-community/slider";
import { MotiView } from "moti";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

import { Button } from "@showtime-xyz/universal.button";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "@showtime-xyz/universal.icon";
import { ModalHeader } from "@showtime-xyz/universal.modal";
import { Pressable } from "@showtime-xyz/universal.pressable";
import "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { getCroppedImg } from "app/lib/canvas-utils";

import { MediaCropperProps } from ".";

export const MediaCropper = ({
  src,
  visible,
  onClose,
  onApply,
  aspect = 1,
}: MediaCropperProps) => {
  const isDark = useIsDarkMode();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );
  const quitCropper = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
  };
  const showCroppedImage = useCallback(async () => {
    try {
      if (!src || !croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(
        src,
        croppedAreaPixels,
        rotation
      );

      croppedImage && onApply?.(croppedImage);
    } catch (e) {
      console.error(e, "showCroppedImage");
    }
  }, [src, croppedAreaPixels, rotation, onApply]);
  return (
    /**
     * Modal instead of ModalSheet is used here because ModalSheet only supports open 1 sheet on mobile.
     */
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onDismiss={() => {
        onClose();
        quitCropper();
      }}
      statusBarTranslucent
    >
      <MotiView
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "timing", duration: 120 }}
      />
      <View tw="h-full w-full items-center justify-end md:justify-center">
        <View tw="w-full rounded-[32px] bg-white dark:bg-black md:w-auto">
          <ModalHeader
            title="Edit Media"
            onClose={onClose}
            startContentComponent={() => (
              <Button
                variant="tertiary"
                size="regular"
                onPress={onClose}
                iconOnly
              >
                <ArrowLeft width={20} height={24} />
              </Button>
            )}
            endContentComponent={() => (
              <Button onPress={showCroppedImage}>Apply</Button>
            )}
          />
          <View tw={`max-h-[82vh] min-h-[560px]`}>
            <View tw="h-[480px] w-full md:w-[480px]">
              {src && (
                <Cropper
                  image={src}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  onRotationChange={setRotation}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </View>
            <View tw="mt-4 flex-row items-center justify-center px-6">
              <Pressable
                onPress={() => setZoom((zoom) => Math.max(zoom - 1, 1))}
              >
                <ZoomOut width={20} height={20} color={colors.gray[500]} />
              </Pressable>
              <Slider
                style={{
                  width: "100%",
                  marginVertical: 8,
                }}
                minimumValue={1}
                maximumValue={3}
                value={zoom}
                minimumTrackTintColor={colors.indigo[500]}
                maximumTrackTintColor={
                  isDark ? colors.gray[700] : colors.gray[200]
                }
                thumbTintColor={colors.indigo[500]}
                onValueChange={setZoom}
                // @ts-ignore
                thumbSize={16}
              />
              <Pressable
                onPress={() => setZoom((zoom) => Math.min(zoom + 1, 3))}
              >
                <ZoomIn width={20} height={20} color={colors.gray[500]} />
              </Pressable>

              <Pressable
                onPress={() => setRotation((rotation) => rotation + 90)}
                tw="ml-2"
              >
                <RotateCw width={20} height={20} color={colors.gray[500]} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
