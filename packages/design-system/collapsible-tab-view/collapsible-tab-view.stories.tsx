import React, { useCallback, useState } from "react";
import { Platform, StatusBar, Text, View } from "react-native";

import { Meta } from "@storybook/react";
import { useSharedValue } from "react-native-reanimated";

import { CollapsibleTabView } from "./index";
import { TabFlatList } from "./index";
import { Route } from "./types";

export default {
  component: CollapsibleTabView,
  title: "Components/CollapsibleTabView",
} as Meta;

const StatusBarHeight = StatusBar.currentHeight ?? 0;
const TabScene = ({ route }: any) => {
  return (
    <TabFlatList
      style={{ backgroundColor: "#333" }}
      index={route.index}
      data={new Array(20).fill(0)}
      renderItem={({ index }) => {
        return (
          <View
            style={{
              height: 60,
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
    <View style={{ height: 300, backgroundColor: "#000" }}></View>
  );

  return (
    <CollapsibleTabView
      onStartRefresh={onStartRefresh}
      isRefreshing={isRefreshing}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      lazy
      renderScrollHeader={renderHeader}
      minHeaderHeight={44 + StatusBarHeight}
      animationHeaderPosition={animationHeaderPosition}
      animationHeaderHeight={animationHeaderHeight}
      style={Platform.select({
        web: { flex: "none" } as any,
        default: undefined,
      })}
    />
  );
};
