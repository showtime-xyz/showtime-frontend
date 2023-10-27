import { useEffect, useState } from "react";

import * as Notifications from "expo-notifications";

import { useRouter } from "@showtime-xyz/universal.router";

export function useHandleNotification() {
  const router = useRouter();
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  useEffect(() => {
    let shouldShowNotification = true;
    if (notification) {
      // TODO:
      // const content = notification?.request?.content?.data?.body?.path;
      // const currentScreen = '';
      // const destinationScreen = '';
      // Don't show if already on the same screen as the destination screen
      // shouldShowNotification = currentScreen !== destinationScreen;
    }

    // priority: AndroidNotificationPriority.HIGH,
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: shouldShowNotification,
        shouldPlaySound: shouldShowNotification,
        shouldSetBadge: false, // shouldShowNotification
      }),
    });
  }, [notification]);

  // Handle push notifications
  useEffect(() => {
    // Handle notifications that are received while the app is open.
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  // Listeners registered by this method will be called whenever a user interacts with a notification (eg. taps on it).
  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const channelId =
          response?.notification?.request?.content?.data?.channel_id;
        if (channelId) {
          router.push(`/channels/${channelId}`);
        } else {
          router.push("/notifications");
        }
        // const content =
        //   Platform.OS === "ios"
        //     ? response?.notification?.request?.content?.data?.body?.path
        //     : response?.notification?.request?.content?.data?.path;
        // Notifications.dismissNotificationAsync(
        //   response?.notification?.request?.identifier
        // );
        // Notifications.setBadgeCountAsync(0);
      });

    return () => Notifications.removeNotificationSubscription(responseListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
