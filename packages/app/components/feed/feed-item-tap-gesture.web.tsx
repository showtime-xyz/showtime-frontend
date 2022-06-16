import React, { useCallback, useState } from "react";

import { AnimatePresence, View as MotiView } from "moti";
import { TapGestureHandler } from "react-native-gesture-handler";

import { HeartFilled } from "@showtime-xyz/universal.icon";
import { tw } from "@showtime-xyz/universal.tailwind";

import { useLike } from "app/context/like-context";

const heartContainerStyle = {
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
} as const;

export const FeedItemTapGesture = ({
  children,
}: {
  children: any;
  toggleHeader: any;
}) => {
  const { like } = useLike();
  const [show, setShow] = useState(false);

  return (
    <>
      {/* @ts-ignore */}
      <TapGestureHandler
        numberOfTaps={2}
        onActivated={useCallback(() => {
          setShow(true);
          setTimeout(() => {
            setShow(false);
          }, 800);
          like();
        }, [like])}
      >
        {children}
      </TapGestureHandler>
      {/* @ts-ignore */}
      <AnimatePresence>
        {show && (
          <MotiView
            style={heartContainerStyle}
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
          >
            <HeartFilled width={90} height={90} color={tw.color("white")} />
          </MotiView>
        )}
      </AnimatePresence>
    </>
  );
};
