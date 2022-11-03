import { useEffect } from "react";
import { Platform, ScrollView } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { Switch } from "@showtime-xyz/universal.switch";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePushNotificationsPreferences } from "app/hooks/use-push-notifications-preferences";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";

import { SlotSeparator } from "../slot-separator";

const ScrollComponent = Platform.OS === "web" ? ScrollView : TabScrollView;

export type PushNotificationTabProp = {
  index?: number;
};
export const PushNotificationTab = ({ index = 0 }: PushNotificationTabProp) => {
  const { isAuthenticated } = useUser();
  const router = useRouter();
  const pushNotificationsPreferences = usePushNotificationsPreferences();

  useEffect(() => {
    const isUnauthenticated = !isAuthenticated;
    if (isUnauthenticated) {
      router.pop();
    }
  }, [isAuthenticated, router]);

  return (
    <ScrollComponent index={index}>
      {pushNotificationsPreferences?.data &&
        Object.entries(pushNotificationsPreferences?.data)?.length > 0 &&
        Object.entries(pushNotificationsPreferences?.data).map(
          (item, index) => {
            const [key, value] = item;
            if (key === "created_at" || key === "updated_at") {
              return null;
            }
            return (
              <View key={index.toString()}>
                <View tw="flex-row items-center justify-between p-4">
                  <Text tw="flex-1 text-sm text-gray-900 dark:text-white">
                    {key.toUpperCase().replace(/_/g, " ")}
                  </Text>
                  <View tw="w-2" />
                  <Switch
                    checked={value as boolean}
                    onChange={async () => {
                      await axios({
                        url: "/v1/notifications/preferences/push",
                        method: "PATCH",
                        data: {
                          [key]: !value,
                        },
                      });
                      pushNotificationsPreferences?.refresh();
                    }}
                  />
                </View>
                {index <
                  Object.entries(pushNotificationsPreferences?.data)?.length -
                    1 && <SlotSeparator />}
              </View>
            );
          }
        )}
    </ScrollComponent>
  );
};
