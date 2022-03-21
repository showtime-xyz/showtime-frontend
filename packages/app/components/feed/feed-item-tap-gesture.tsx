import React, { useCallback, useRef } from "react";

import { TapGestureHandler } from "react-native-gesture-handler";

import { useLike } from "app/context/like-context";

export const FeedItemTapGesture = ({
  children,
  toggleHeader,
  showHeader,
}: {
  children: any;
  toggleHeader: any;
  showHeader: any;
}) => {
  const { toggleLike } = useLike();
  const doubleTapRef = useRef();

  return (
    <TapGestureHandler waitFor={doubleTapRef} onActivated={toggleHeader}>
      <TapGestureHandler
        ref={doubleTapRef}
        numberOfTaps={2}
        onActivated={useCallback(() => {
          toggleLike();
          showHeader();
        }, [toggleLike, showHeader])}
      >
        {children}
      </TapGestureHandler>
    </TapGestureHandler>
  );
};
