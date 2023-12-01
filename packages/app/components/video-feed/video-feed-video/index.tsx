import { useRef, useContext, useEffect } from "react";

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/core";
import IVSPlayer from "amazon-ivs-react-native-player";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

import { Text } from "@showtime-xyz/universal.text";

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
  const { width, height, uri } = props;

  const id = useContext(ItemKeyContext);
  const context = useContext(ViewabilityItemsContext);
  const isItemInList = typeof id !== "undefined";
  const isVisibleRef = useRef(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const wasStoppedBecauseOfBlur = useRef(false);

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
      if (wasStoppedBecauseOfBlur.current && isVisibleRef.current) {
        wasStoppedBecauseOfBlur.current = false;
        setVisible(true);
      }
    });
    const blurListener = navigation.addListener("blur", () => {
      if (isVisibleRef.current) {
        wasStoppedBecauseOfBlur.current = true;
        setVisible(false);
      }
    });
    return () => {
      focusListener();
      blurListener();
    };
  }, [navigation, setVisible]);

  useAnimatedReaction(
    () => context.value,
    (ctx) => {
      if (isItemInList && isFocused) {
        if (ctx[1] === id) {
          runOnJS(setVisible)(true);
        } else {
          runOnJS(setVisible)(false);
        }
      } else {
        runOnJS(setVisible)(false);
      }
    },
    [id, isItemInList, context, isFocused]
  );

  const onPlayerStateChange = (onPlayerStateChange: any) => {
    // Sometimes IVS can become idle. Could be play pause race conditions.
    // Not very sure, but this fixes it. Dig more later.
    if (onPlayerStateChange === "Idle" && isVisibleRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <>
      <IVSPlayer
        //  @ts-ignore
        style={{ width, height }}
        ref={videoRef}
        resizeMode={"aspectFill"}
        streamUrl={uri as string}
        autoplay={false}
        muted={muted}
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
