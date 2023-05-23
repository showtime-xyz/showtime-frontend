import { useCallback, useState } from "react";

import { TabView } from "react-native-tab-view";

import {
  Route,
  SceneRendererProps,
  ScollableAutoWidthTabBar,
} from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

import { reactionEmojis } from "../reaction/constants";
import { UserList } from "../user-list";

export const ReactionsRoutes = ["All", ...reactionEmojis].map(
  (emoji, index) => {
    return {
      index,
      title: emoji,
      key: emoji,
    };
  }
);

export const MessageReactionUserListModal = () => {
  const [index, setIndex] = useState(0);
  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      return (
        <UserList
          loading={false}
          users={[
            {
              profile_id: 1,
              username: "test",
              verified: true,
              follows_you: false,
              img_url: "https://picsum.photos/200",
              name: "nishan",
              timestamp: "2021-08-10T12:00:00.000Z",
              wallet_address: "0x123",
            },
          ]}
        />
      );
    },
    []
  );
  return (
    <View tw="flex-1">
      <TabView
        renderTabBar={ScollableAutoWidthTabBar}
        navigationState={{ index, routes: ReactionsRoutes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </View>
  );
};
