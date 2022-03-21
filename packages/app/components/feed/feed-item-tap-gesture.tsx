import React, { useRef } from "react";

import { TapGestureHandler } from "react-native-gesture-handler";

import { useLike } from "app/context/like-context";

export const FeedItemTapGesture = ({
  children,
  toggleHeader,
}: {
  children: any;
  toggleHeader: any;
}) => {
  const { toggleLike } = useLike();
  const doubleTapRef = useRef();

  return (
    <TapGestureHandler waitFor={doubleTapRef} onActivated={toggleHeader}>
      <TapGestureHandler
        ref={doubleTapRef}
        numberOfTaps={2}
        onActivated={toggleLike}
      >
        {children}
      </TapGestureHandler>
    </TapGestureHandler>
  );
};
