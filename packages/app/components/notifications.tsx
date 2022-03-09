import { useCallback } from "react";
import { FlatList } from "react-native";

import {
  NotificationType,
  useNotifications,
} from "app/hooks/use-notifications";

import { Text, View } from "design-system";

type NotificationCardProp = { item: NotificationType };

export const Notifications = () => {
  const { data } = useNotifications();

  const renderItem = useCallback(({ item }: NotificationCardProp) => {
    return <NotificationCard item={item} />;
  }, []);

  return <FlatList data={data} renderItem={renderItem} />;
};

const NotificationCard = ({ item }: NotificationCardProp) => {
  return (
    <View>
      <Text>hi</Text>
    </View>
  );
};
