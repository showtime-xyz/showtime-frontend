import React, { useRef, useCallback, useEffect, useState } from "react";
import { View } from "react-native";

import * as Portal from "@radix-ui/react-portal";
import { AnimatePresence, MotiView } from "moti";

import { useIsMobileWeb } from "app/hooks/use-is-mobile-web";

import { tw as tailwind } from "../tailwind";
import { Position } from "./position";
import { TooltipContent } from "./tooltop.content";
import { TooltipProps } from "./types";

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  delay,
  open,
  placement,
  tw,
  style,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  const triggerEl = useRef<View>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const { isMobileWeb } = useIsMobileWeb();

  const onMouseEnter = () => {
    if (!delay && isMobileWeb) {
      setShow(true);
    }
    timeout.current && clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setShow(true);
    }, delay);
  };

  const onMouseLeave = useCallback(() => {
    setShow(false);
    timeout.current && clearTimeout(timeout.current);
  }, []);

  useEffect(() => {
    setShow(Boolean(open));
  }, [open]);

  return (
    <>
      <View
        // @ts-ignore
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={triggerEl}
        style={[tailwind.style(tw), style]}
      >
        {children}
      </View>
      {/* @ts-ignore */}
      <AnimatePresence>
        {show && (
          <Portal.Root style={tailwind.style(`w-full`)}>
            <MotiView
              from={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{ type: "timing", duration: 250 }}
            >
              <Position triggerRef={triggerEl} placement={placement} {...rest}>
                <TooltipContent text={text} placement={placement} {...rest} />
              </Position>
            </MotiView>
          </Portal.Root>
        )}
      </AnimatePresence>
    </>
  );
};
