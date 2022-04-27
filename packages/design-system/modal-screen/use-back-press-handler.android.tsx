import { RefObject, useCallback } from "react";
import { BackHandler } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import type { ModalMethods } from "design-system/modal-new";

export const useBackPressHandler = (ref: RefObject<ModalMethods>) => {
  return useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        ref.current?.close();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
};
