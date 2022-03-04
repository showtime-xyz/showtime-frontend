import { Modal, Pressable, View } from "react-native";

import { ArrowLeft } from "design-system/icon";

import { SwipeList } from "./swipe-list";

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
  return (
    <Modal visible={visible} transparent animationType="slide">
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
        data={data.filter((d) => d)}
        fetchMore={fetchMore}
        isRefreshing={isRefreshing}
        refresh={refresh}
        isLoadingMore={isLoadingMore}
        initialScrollIndex={initialScrollIndex}
      />
    </Modal>
  );
};
