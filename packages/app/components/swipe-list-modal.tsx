import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Modal, Pressable, View } from "react-native";

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  runOnUI,
} from "react-native-reanimated";

import { ArrowLeft } from "design-system/icon";

import { SwipeList } from "./swipe-list";

const screenWidth = Dimensions.get("screen").width;

export const SwipeListModal = ({
  data,
  fetchMore,
  isRefreshing,
  refresh,
  isLoadingMore,
  initialScrollIndex,
  visible,
  hide,
}: any) => {
  const translateX = useSharedValue(screenWidth);
  const [modalVisible, setModalVisible] = useState(false);
  const prevModalVisible = useRef(false);

  const slideIn = useCallback(() => {
    "worklet";
    translateX.value = withTiming(0, { duration: 200 });
  }, []);

  const slideOut = useCallback(() => {
    "worklet";
    // slide out and hide the modal
    translateX.value = withTiming(
      screenWidth,
      { duration: 100 },
      (finished) => {
        if (finished) {
          runOnJS(setModalVisible)(false);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
    } else if (prevModalVisible.current) {
      runOnUI(slideOut)();
    }

    prevModalVisible.current = visible;
  }, [visible]);

  useEffect(() => {
    if (modalVisible) runOnUI(slideIn)();
  }, [modalVisible]);

  const tap = Gesture.Pan()
    .onUpdate((e) => {
      if (e.velocityX > e.velocityY || translateX.value > 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (translateX.value > screenWidth / 2 || e.velocityX > 500) {
        translateX.value = withTiming(
          screenWidth,
          { duration: 100 },
          (finished) => {
            if (finished) {
              runOnJS(hide)();
            }
          }
        );
      } else {
        translateX.value = withTiming(0);
      }
    });

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  }, []);

  return (
    <Modal visible={modalVisible} transparent>
      <GestureHandlerRootView>
        <GestureDetector gesture={tap}>
          <Animated.View collapsable={false} style={style}>
            <View
              style={{
                position: "absolute",
                top: 40,
                left: 10,
                height: 100,
                width: 100,
                zIndex: 100,
              }}
            >
              <Pressable onPress={hide}>
                <ArrowLeft color="white" height={36} width={36} />
              </Pressable>
            </View>
            <SwipeList
              data={data}
              fetchMore={fetchMore}
              isRefreshing={isRefreshing}
              refresh={refresh}
              isLoadingMore={isLoadingMore}
              initialScrollIndex={initialScrollIndex}
            />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};
