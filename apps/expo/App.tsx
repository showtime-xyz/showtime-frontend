import { useState } from "react";
import { StyleSheet, Image } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const useViewDimension = () => {
  const [dimension, setDimension] = useState({ height: 0, width: 0 });
  return {
    onLayout: (e) => {
      setDimension({
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      });
    },
    width: dimension.width,
    height: dimension.height,
  };
};

const PinchToZoom = ({
  children,
  onGestureEnd,
  onDoubleTap,
  enableDoubleTap = false,
}) => {
  const offset = { x: useSharedValue(0), y: useSharedValue(0) };
  const start = { x: useSharedValue(0), y: useSharedValue(0) };
  const scaleOrigin = { x: useSharedValue(0), y: useSharedValue(0) };
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const dragState = useSharedValue("idle");
  const zoomState = useSharedValue("idle");
  const { width, height, onLayout } = useViewDimension();
  const [isZoomStarted, setIsZoomStarted] = useState(false);

  const dragGesture = Gesture.Pan()
    .onBegin(() => {
      dragState.value = "start";
      start.x.value = offset.x.value;
      start.y.value = offset.y.value;
    })
    .onUpdate((e) => {
      offset.x.value = e.translationX + start.x.value;
      offset.y.value = e.translationY + start.y.value;
    })
    .onEnd(() => {
      dragState.value = "ended";
    });

  const doubleTapGesture = Gesture.Tap()
    .enabled(enableDoubleTap)
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
        onDoubleTap?.({ scale, offset });
      }
    });

  const zoomGesture = Gesture.Pinch()
    .onBegin((e) => {
      zoomState.value = "start";
      savedScale.value = scale.value;
      scaleOrigin.x.value = e.focalX;
      scaleOrigin.y.value = e.focalY;
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      zoomState.value = "ended";
    });

  const composed = Gesture.Exclusive(
    Gesture.Simultaneous(dragGesture, zoomGesture),
    doubleTapGesture
  );

  useDerivedValue(() => {
    if (zoomState.value === "ended" && dragState.value === "ended") {
      onGestureEnd?.({ scale, offset, start });
    }
    if (zoomState.value === "ended") {
      zoomState.value = "idle";
    }

    if (dragState.value === "ended") {
      dragState.value = "idle";
    }
  });

  // useAnimatedReaction(
  //   () => {
  //     return scale.value > 1;
  //   },
  //   (started) => {
  //     if (started) {
  //       runOnJS(setIsZoomStarted)(true);
  //     } else {
  //       runOnJS(setIsZoomStarted)(false);
  //     }
  //   }
  // );
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.x.value },
        { translateY: offset.y.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyles} onLayout={onLayout}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <PinchToZoom
        onGestureEnd={({ scale, offset, start }) => {
          "worklet";
          // zoom out on gesture end
          scale.value = withTiming(1, { duration: 500 });
          offset.x.value = withTiming(0, { duration: 500 });
          offset.y.value = withTiming(0, { duration: 500 });
          start.x.value = withTiming(0, { duration: 500 });
          start.y.value = withTiming(0, { duration: 500 });
        }}
        enableDoubleTap
        onDoubleTap={({ scale, offset }) => {
          "worklet";
          // zoom out if zoomed in
          if (scale.value > 1) {
            offset.x.value = withTiming(0, { duration: 500 });
            offset.y.value = withTiming(0, { duration: 500 });
            scale.value = withTiming(1, { duration: 500 });
          }
          // zoom in
          else {
            scale.value = withTiming(2);
          }
        }}
      >
        <Image
          style={{ height: 235, width: 354 }}
          source={{
            uri: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80",
          }}
        />
      </PinchToZoom>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
