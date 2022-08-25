import React, { useCallback, useState } from "react";
import { Platform, Text, View } from "react-native";

import { Meta } from "@storybook/react";
import { useSharedValue } from "react-native-reanimated";

import { HeaderTabView } from "./index";
import { TabInfiniteScrollList } from "./index";
import { Route } from "./index";

const LIST_LENGTH = 24;
const ITEM_HEIGHT = 60;
const HEADER_HEIGHT = 300;

export default {
  component: HeaderTabView,
  title: "Components/HeaderTabView",
} as Meta;

const TabScene = ({ route }: any) => {
  return (
    <TabInfiniteScrollList
      style={{ backgroundColor: "#333" }}
      index={route.index}
      data={new Array(LIST_LENGTH).fill(0)}
      renderItem={({ index }) => {
        return (
          <View
            style={{
              height: ITEM_HEIGHT,
              backgroundColor: "#fff",
              marginBottom: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{`${route.title}-Item-${index}`}</Text>
          </View>
        );
      }}
      estimatedItemSize={ITEM_HEIGHT}
      overscan={{
        main: ITEM_HEIGHT,
        reverse: ITEM_HEIGHT,
      }}
    />
  );
};
export const Basic: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [routes] = useState<Route[]>([
    { key: "like", title: "Like", index: 0 },
    { key: "owner", title: "Owner", index: 1 },
    { key: "created", title: "Created", index: 2 },
  ]);
  const [index, setIndex] = useState(0);
  const animationHeaderPosition = useSharedValue(0);
  const animationHeaderHeight = useSharedValue(0);

  const renderScene = useCallback(({ route }: any) => {
    switch (route.key) {
      case "like":
        return <TabScene route={route} index={0} />;

      case "owner":
        return <TabScene route={route} index={1} />;

      case "created":
        return <TabScene route={route} index={2} />;

      default:
        return null;
    }
  }, []);

  const onStartRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      console.log("onStartRefresh");
      setIsRefreshing(false);
    }, 300);
  };
  const renderHeader = () => (
    <View
      style={{
        height: HEADER_HEIGHT,
        backgroundColor: "#333",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontWeight: "600",
          color: "#fff",
          fontSize: 24,
          marginBottom: 10,
        }}
      >
        Features
      </Text>
      <Text style={{ color: "#fff", fontSize: 16 }}>
        Header: support any custom touch or gesture event.
      </Text>
      <Text style={{ color: "#fff", fontSize: 16 }}>
        List: use react-virtuoso on web, use FlashList on native.
      </Text>
      <Text style={{ color: "#fff", fontSize: 16 }}>
        Tabbar: support sticky on web.
      </Text>
    </View>
  );

  return (
    <HeaderTabView
      onStartRefresh={onStartRefresh}
      isRefreshing={isRefreshing}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderScrollHeader={renderHeader}
      minHeaderHeight={44}
      refreshControlTop={44}
      autoWidthTabBar
      animationHeaderPosition={animationHeaderPosition}
      animationHeaderHeight={animationHeaderHeight}
      style={Platform.select({
        web: { flex: "none" } as any,
        default: undefined,
      })}
    />
  );
};
