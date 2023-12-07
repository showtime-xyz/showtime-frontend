import { useRef, useContext, useEffect } from "react";
import { AppState } from "react-native";

import { useNavigation } from "@react-navigation/core";
import IVSPlayer from "amazon-ivs-react-native-player";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

import {
  ItemKeyContext,
  ViewabilityItemsContext,
} from "app/hocs/with-viewability-infinite-scroll-list";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { useMuted } from "app/providers/mute-provider";

import { VideoProps } from "./type";

export const FeedVideo = (props: VideoProps) => {
  const videoRef = useRef<any>(null);
  const [muted] = useMuted();
  const { width, height, uri, aspectRatio } = props;

  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";
  const isVisibleRef = useRef(false);
  const navigation = useNavigation();
  const wasStoppedBecauseOfNavigationBlur = useRef(false);
  const wasStoppedBecauseOfAppStateBlur = useRef(false);

  const setVisible = useStableCallback((visible: boolean) => {
    isVisibleRef.current = visible;
    if (visible) {
      videoRef.current.play();
    } else {
      videoRef.current.seekTo(0);
      videoRef.current.pause();
    }
  });

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      if (wasStoppedBecauseOfNavigationBlur.current && isVisibleRef.current) {
        wasStoppedBecauseOfNavigationBlur.current = false;
        videoRef.current.play();
      }
    });

    const blurListener = navigation.addListener("blur", () => {
      if (isVisibleRef.current) {
        wasStoppedBecauseOfNavigationBlur.current = true;
        videoRef.current.pause();
      }
    });

    const appStateListener = AppState.addEventListener("change", (state) => {
      if (isVisibleRef.current) {
        if (state === "active" && wasStoppedBecauseOfAppStateBlur.current) {
          wasStoppedBecauseOfAppStateBlur.current = false;
          videoRef.current.play();
        } else if (state === "background" || state === "inactive") {
          wasStoppedBecauseOfAppStateBlur.current = true;
          videoRef.current.pause();
        }
      }
    });

    return () => {
      focusListener();
      blurListener();
      appStateListener.remove();
    };
  }, [navigation, setVisible]);

  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      if (isItemInList) {
        if (ctx[1] === id) {
          runOnJS(setVisible)(true);
        } else {
          runOnJS(setVisible)(false);
        }
      } else {
        runOnJS(setVisible)(false);
      }
    },
    [id, isItemInList, context]
  );

  const onPlayerStateChange = (onPlayerStateChange: any) => {
    // Sometimes IVS can become idle. Could be play pause race conditions.
    // Not very sure, but this fixes it. Dig more later.
    if (
      onPlayerStateChange === "Idle" &&
      isVisibleRef.current &&
      !wasStoppedBecauseOfNavigationBlur.current &&
      !wasStoppedBecauseOfAppStateBlur.current
    ) {
      videoRef.current.play();
    }
  };

  const resizeMode = aspectRatio > 0.65 ? "aspectFit" : "aspectFill";

  return (
    <>
      <IVSPlayer
        //  @ts-ignore
        style={{ width, height }}
        ref={videoRef}
        resizeMode={resizeMode}
        streamUrl={uri as string}
        autoplay={false}
        muted={muted}
        paused={true}
        initialBufferDuration={0.5}
        autoQualityMode={false}
        liveLowLatency={false}
        onPlayerStateChange={onPlayerStateChange}
        loop
        key={uri}
      />
    </>
  );
};
