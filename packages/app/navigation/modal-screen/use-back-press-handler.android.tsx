import { RefObject, useCallback } from "react";
import { BackHandler, Platform } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import type { ModalMethods } from "design-system/modal-new";

export const useBackPressHandler = (ref: RefObject<ModalMethods>) => {
  return useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        ref.current?.close();
        console.log("withModalScreen", "onBackPress");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
};
