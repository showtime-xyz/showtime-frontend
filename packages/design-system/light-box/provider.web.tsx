import React, { createContext, useContext, useMemo, useState } from "react";
import { Modal } from "react-native";

import { useEscapeKeydown } from "@radix-ui/react-use-escape-keydown";
import { RemoveScrollBar } from "react-remove-scroll-bar";

import { Close } from "@showtime-xyz/universal.icon";
import { Pressable } from "@showtime-xyz/universal.pressable";
import { colors } from "@showtime-xyz/universal.tailwind";
import { View } from "@showtime-xyz/universal.view";

import type { LightBoxProps } from "./light-box";

export type AnimationWebParams = Pick<
  LightBoxProps,
  "onTap" | "tapToClose" | "onLongPress" | "nativeHeaderHeight"
> & {
  imageElement: JSX.Element;
};

type LightBoxContextType = {
  show: (params: AnimationWebParams) => void;
};

export const LightBoxContext = createContext<LightBoxContextType | null>(null);

export const LightBoxProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [imageElement, setImageElement] = useState<JSX.Element | null>(null);
  const [visible, setVisible] = useState(false);
  const value = useMemo(
    () => ({
      show: ({ imageElement }: AnimationWebParams) => {
        setImageElement(imageElement);
        setVisible(true);
      },
    }),
    []
  );

  useEscapeKeydown((event) => {
    if (!event.defaultPrevented) {
      onClose?.();
    }
  });

  const onClose = () => {
    setVisible(false);
    setImageElement(null);
  };

  return (
    <LightBoxContext.Provider value={value}>
      {children}
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent
        animationType="fade"
      >
        <RemoveScrollBar />
        <View tw="flex-1 items-center justify-center">
          <div
            onClick={onClose}
            className="absolute left-0 right-0 top-0 bottom-0 bg-white bg-opacity-80 dark:bg-black"
          />

          {imageElement}
        </View>
        <Pressable onPress={onClose} tw="absolute left-8 top-8">
          <Close color={colors.gray[400]} width={24} height={24} />
        </Pressable>
      </Modal>
    </LightBoxContext.Provider>
  );
};

export const useLightBox = () => {
  const lightBox = useContext(LightBoxContext);
  if (!lightBox) {
    console.error("Trying to use useLightBox without a LightBoxProvider");
  }
  return lightBox;
};
