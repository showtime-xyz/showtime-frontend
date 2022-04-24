import React, { FC, useCallback, useRef, useState } from "react";
import { BackHandler, Platform } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { ModalMethods } from "design-system/modal-new";
import { ModalScreen } from "design-system/modal-new/modal.screen";

import { useRouter } from "../use-router";

const snapPoints = ["90%", "100%"];

function withModalScreen<P>(Screen: FC<P>, title?: string) {
  return function (props: P) {
    const modalRef = useRef<ModalMethods>(null);
    const { pop } = useRouter();
    const onClose = useCallback(() => {
      pop();
    }, [pop]);

    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          modalRef.current?.close();
          console.log("withModalScreen", "onBackPress");
          return true;
        };

        BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () =>
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }, [])
    );
    return (
      <ModalScreen
        ref={modalRef}
        title={title}
        mobile_snapPoints={snapPoints}
        isScreen={true}
        onClose={onClose}
      >
        <Screen {...props} />
      </ModalScreen>
    );
  };
}

export { withModalScreen };
