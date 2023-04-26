import { useState, useCallback } from "react";
import { Modal } from "react-native";

import * as Slider from "@radix-ui/react-slider";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";

import { Button } from "@showtime-xyz/universal.button";
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "@showtime-xyz/universal.icon";
import { ModalHeader } from "@showtime-xyz/universal.modal";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import { getCroppedImg } from "app/lib/canvas-utils";
import { Logger } from "app/lib/logger";

import { MediaCropperProps } from ".";

export const MediaCropper = ({
  src,
  visible,
  onClose,
  onApply,
  aspect = 1,
  title = "Edit Media",
  cropViewHeight = 400,
}: MediaCropperProps) => {
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

  const startContentComponent = useCallback(() => {
    return (
      <Button variant="tertiary" size="regular" onPress={onClose} iconOnly>
        <ArrowLeft width={20} height={24} />
      </Button>
    );
  }, [onClose]);

  const showCroppedImage = useCallback(async () => {
    try {
      if (!src || !croppedAreaPixels) return;

      const croppedImage = await getCroppedImg(
        src as string,
        croppedAreaPixels,
        rotation
      );

      croppedImage && onApply?.(croppedImage);
    } catch (e) {
      Logger.error(e, "showCroppedImage");
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
      <View tw="animate-fade-in-250 absolute inset-0 bg-black/30" />
      <View tw="h-full w-full items-center justify-end md:justify-center">
        <View tw="rounded-t-4xl md:rounded-b-4xl w-full border-b-0 bg-white dark:bg-black md:w-auto">
          <ModalHeader
            title={title}
            onClose={onClose}
            startContentComponent={startContentComponent}
          />
          <View tw="max-h-[82vh]">
            <View tw="w-full md:w-[480px]" style={{ height: cropViewHeight }}>
              {src && (
                <Cropper
                  image={src as string}
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
            <View tw="mt-6 flex-row items-center justify-center px-4">
              <Pressable
                onPress={() => setZoom((zoom) => Math.max(zoom - 1, 1))}
              >
                <ZoomOut width={20} height={20} color={colors.gray[500]} />
              </Pressable>
              <Slider.Root
                className="relative mx-2 flex h-5 w-full touch-none select-none items-center"
                defaultValue={[1]}
                min={1}
                max={3}
                step={0.01}
                value={[zoom]}
                aria-label="Zoom Image"
                onValueChange={(v) => setZoom(v[0])}
              >
                <Slider.Track className="bg-blackA10 relative h-1 grow rounded-full bg-gray-200 dark:bg-gray-700">
                  <Slider.Range className="absolute h-full rounded-full bg-indigo-500" />
                </Slider.Track>
                <Slider.Thumb className="shadow-blackA7 hover:bg-violet3 focus:shadow-blackA8 block h-4 w-4 rounded-full bg-indigo-500 focus:outline-none" />
              </Slider.Root>
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
            <View tw="mb-8 mt-6 px-4">
              <Button size="regular" onPress={showCroppedImage}>
                Looks Good
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
