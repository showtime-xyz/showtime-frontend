import { StatusBar } from "expo-status-bar";
import { StyleSheet, Image, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const PinchToZoom = ({
  children,
  onGestureEnd,
  onDoubleTap,
  enableDoubleTap = false,
}) => {
  const offset = { x: useSharedValue(0), y: useSharedValue(0) };
  const start = { x: useSharedValue(0), y: useSharedValue(0) };
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const dragState = useSharedValue("idle");
  const zoomState = useSharedValue("idle");

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.x.value },
        { translateY: offset.y.value },
        { scale: scale.value },
        { rotateZ: `${rotation.value}rad` },
      ],
    };
  });

  const dragGesture = Gesture.Pan()
    .onBegin(() => {
      dragState.value = "start";
      start.x.value = offset.x.value;
      start.y.value = offset.y.value;
    })
    .onUpdate((e) => {
      if (scale.value > 1) {
        offset.x.value = e.translationX + start.x.value;
        offset.y.value = e.translationY + start.y.value;
      }
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
    .onBegin(() => {
      zoomState.value = "start";
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      zoomState.value = "ended";
    });

  const rotateGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Exclusive(
    Gesture.Simultaneous(dragGesture, zoomGesture),
    doubleTapGesture
  );

  useAnimatedReaction(
    () => {
      return zoomState.value === "ended" && dragState.value === "ended";
    },
    (hasEnded) => {
      if (hasEnded) {
        onGestureEnd?.({ scale, offset, start });
      }
    }
  );

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyles}>{children}</Animated.View>
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
        onGestureEnd={({ scale, offset }) => {
          "worklet";
          scale.value = withTiming(1, { duration: 500 });
          offset.x.value = withTiming(0, { duration: 500 });
          offset.y.value = withTiming(0, { duration: 500 });
        }}
        enableDoubleTap
        onDoubleTap={({ scale, offset }) => {
          "worklet";
          if (scale.value > 1) {
            offset.x.value = withTiming(0, { duration: 500 });
            offset.y.value = withTiming(0, { duration: 500 });
            scale.value = withTiming(1, { duration: 500 });
          } else {
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
