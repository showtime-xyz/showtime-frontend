import { RefObject, useCallback } from "react";
import { BackHandler } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import type { ModalMethods } from "@showtime-xyz/universal.modal";

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );
};
