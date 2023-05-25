import { useCallback, useState, useMemo, useEffect } from "react";

import { TabView } from "react-native-tab-view";

import {
  Route,
  SceneRendererProps,
  ScollableAutoWidthTabBar,
} from "@showtime-xyz/universal.tab-view";
import { View } from "@showtime-xyz/universal.view";

import { createParam } from "app/navigation/use-param";

import { UserList } from "../user-list";
import { useChannelReactions } from "./hooks/use-channel-reactions";
import { useReactionsUserList } from "./use-reactions-user-list";

type Query = {
  channelId: string;
  messageId: string;
  selectedReactionId: string;
};
const { useParam } = createParam<Query>();

export const MessageReactionUserListModal = () => {
  const [channelId] = useParam("channelId");
  const [selectedReactionId] = useParam("selectedReactionId");
  const [index, setIndex] = useState(0);
  const reactions = useChannelReactions(channelId);

  const routes = useMemo(() => {
    if (!reactions.data) return [];
    return reactions.data.map((r, index) => {
      return {
        index,
        title: r.reaction,
        key: r.id.toString(),
      };
    });
  }, [reactions.data]);

  useEffect(() => {
    if (!routes || !selectedReactionId) return;
    const index = routes.findIndex((r) => r.key === selectedReactionId);
    if (index !== -1) {
      setIndex(index);
    }
  }, [routes, selectedReactionId]);

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => {
      return (
        <ReactionUserList
          reactionId={route.key}
          mount={index === route.index}
        />
      );
    },
    [index]
  );

  if (!selectedReactionId || !reactions.data) return null;

  return (
    <View tw="flex-1">
      <TabView
        renderTabBar={ScollableAutoWidthTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </View>
  );
};

const ReactionUserList = ({
  reactionId,
  mount,
}: {
  reactionId: string;
  mount: boolean;
}) => {
  const [messageId] = useParam("messageId");
  const reactionsUsers = useReactionsUserList(
    mount ? { messageId, reactionId } : {}
  );

  return (
    <UserList
      loading={reactionsUsers.isLoading}
      users={reactionsUsers.users}
      onEndReached={reactionsUsers.fetchMore}
    />
  );
};
