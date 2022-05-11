import React, { useRef, useCallback, useState, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AnimatePresence, MotiView } from "moti";

import { tw as tailwind } from "../tailwind";
import { Placement, PlatformRect } from "./get-placement";
import { Position } from "./position";
import { TooltipContent } from "./tooltop.content";
import { TooltipProps } from "./types";

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  // eslint-disable-next-line unused-imports/no-unused-vars
  delay,
  open,
  placement,
  tw,
  style,
  ...rest
}) => {
  const triggerEl = useRef<View>(null);
  const [show, setShow] = useState(false);
  const [triggerRect, setTriggerRect] = useState<PlatformRect>(null);

  const onPress = useCallback(() => {
    setShow(!show);
  }, [show, setShow]);

  useEffect(() => {
    setShow(Boolean(open));
  }, [open]);
  return (
    <>
      <Pressable
        onPress={onPress}
        onLayout={({
          nativeEvent: {
            layout: { x, y, height, width },
          },
        }) => {
          setTriggerRect({
            height,
            width,
            top: y,
            left: x,
          });
        }}
        ref={triggerEl}
        style={[tailwind.style(tw), style]}
      >
        {children}
      </Pressable>
      {/* @ts-ignore */}
      <AnimatePresence>
        {show && (
          <View
            style={[StyleSheet.absoluteFillObject, { zIndex: 999 }]}
            onTouchStart={() => {
              setShow(false);
            }}
          >
            <MotiView
              from={{
                transform: [
                  { translateY: placement === Placement.bottom ? 8 : -8 },
                ],
                opacity: 0,
              }}
              animate={{
                transform: [
                  {
                    translateY: 0,
                  },
                ],
                opacity: 1,
              }}
              exit={{
                transform: [
                  { translateY: placement === Placement.bottom ? 8 : -8 },
                ],
                opacity: 0,
              }}
              transition={{ type: "timing", duration: 250 }}
            >
              <Position
                triggerRef={triggerEl}
                triggerRect={triggerRect}
                placement={placement}
                {...rest}
              >
                <TooltipContent text={text} placement={placement} {...rest} />
              </Position>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </>
  );
};
