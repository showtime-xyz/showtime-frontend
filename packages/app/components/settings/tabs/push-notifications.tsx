import { useEffect } from "react";
import { Platform } from "react-native";

import { useRouter } from "@showtime-xyz/universal.router";
import { Switch } from "@showtime-xyz/universal.switch";
import { TabScrollView } from "@showtime-xyz/universal.tab-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { usePushNotificationsPreferences } from "app/hooks/use-push-notifications-preferences";
import { useUser } from "app/hooks/use-user";
import { axios } from "app/lib/axios";

import { SettingsTitle } from "../settings-title";

const ScrollComponent = Platform.OS === "web" ? View : TabScrollView;

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
      <SettingsTitle
        title="Push Notifications"
        desc="Manage your app notifications."
      />
      <View tw="mt-0 px-4 md:mt-4 md:px-0">
        {pushNotificationsPreferences?.data &&
          Object.entries(pushNotificationsPreferences?.data)?.length > 0 &&
          Object.entries(pushNotificationsPreferences?.data).map(
            (item, index) => {
              const [key, value] = item;
              if (key === "created_at" || key === "updated_at") {
                return null;
              }
              return (
                <View tw="flex-row items-center py-4" key={index.toString()}>
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
                  <View tw="ml-2 md:ml-4">
                    <Text tw="break-words text-base font-medium text-gray-900 dark:text-white">
                      {key
                        .replace(/_/g, " ")
                        .replace(/^\S/, (s) => s.toUpperCase())}
                    </Text>
                  </View>
                </View>
              );
            }
          )}
      </View>
    </ScrollComponent>
  );
};
