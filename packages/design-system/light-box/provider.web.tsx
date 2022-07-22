import React, { createContext, useContext, useMemo, useState } from "react";
import { Modal } from "react-native";

import { useEscapeKeydown } from "@radix-ui/react-use-escape-keydown";

import { tw } from "@showtime-xyz/universal.tailwind";
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
        <View tw="flex-1 items-center justify-center">
          <div
            onClick={onClose}
            style={tw.style(
              "dark:bg-black bg-white bg-opacity-80 absolute left-0 right-0 top-0 bottom-0"
            )}
          />
          {imageElement}
        </View>
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
