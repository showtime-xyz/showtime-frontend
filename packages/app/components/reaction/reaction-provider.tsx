import { useState, createContext, useMemo, useEffect } from "react";
import { Modal } from "react-native";

import { MotiView } from "moti";

import { Pressable } from "@showtime-xyz/universal.pressable";
import { View } from "@showtime-xyz/universal.view";

export const ReactionContext = createContext(
  null as unknown as {
    visible: boolean;
    setVisible: (v: boolean) => void;
    setPosition: (v: { top: number; left: number }) => void;
    setReactions: (v: any) => void;
  }
);

export const ReactionProvider = ({ children }: any) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [reactions, setReactions] = useState<any>(null);
  const memoizedValue = useMemo(
    () => ({ visible, setVisible, setPosition, setReactions }),
    [visible]
  );
  const handleClose = () => setVisible(false);

  return (
    <ReactionContext.Provider value={memoizedValue}>
      {children}
      <Modal
        visible={visible}
        onDismiss={handleClose}
        transparent
        onRequestClose={handleClose}
      >
        <MotiView
          style={{ flex: 1 }}
          from={{ translateX: -8 }}
          animate={{ translateX: 0 }}
          transition={{ type: "spring", damping: 9, mass: 0.75 }}
        >
          <Pressable tw="absolute h-full w-full" onPress={handleClose} />
          <View tw="absolute" style={position}>
            {reactions}
          </View>
        </MotiView>
      </Modal>
    </ReactionContext.Provider>
  );
};
