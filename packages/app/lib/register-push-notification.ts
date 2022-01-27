import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

async function getNotificationPermissionStatus() {
  const status = await Notifications.getPermissionsAsync();
  return status.granted; // || status.ios ? status.ios.status === 3 : false;
}

async function updateNativeDevicePushToken(
  userId: number,
  devicePushToken: Notifications.DevicePushToken
) {
  // TODO: store native device push token in database
}

async function updateWebDevicePushToken(
  userId: number,
  devicePushToken: Notifications.WebDevicePushToken
) {
  // TODO: store web device push token in database
}

async function updateExpoPushToken(
  userId: number,
  expoPushToken: Notifications.ExpoPushToken
) {
  // TODO: store expo push token in database
}

async function registerForPushNotificationsAsync({
  userId,
}: {
  userId?: number;
}) {
  if (!Device.isDevice) {
    return;
  }

  // On Android, we need to specify a channel.
  // Find out more specifics in the expo-notifications documentation
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const experienceId = "@tryshowtime/showtime";
  const applicationId = "io.showtime";

  let granted = await getNotificationPermissionStatus();

  // Only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (!granted) {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const status = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    granted = status.granted;
  }

  // Stop here if the user did not grant permissions
  if (!granted) {
    return;
  }

  // Get the device token. Can be used with another push notification service
  const devicePushToken = await Notifications.getDevicePushTokenAsync();
  console.log(devicePushToken);

  if (userId) {
    if (devicePushToken.type === "web") {
      updateWebDevicePushToken(userId, devicePushToken);
    } else {
      updateNativeDevicePushToken(userId, devicePushToken);
    }
  }

  // Get the expo token
  const expoPushToken = await Notifications.getExpoPushTokenAsync({
    experienceId,
    applicationId,
    devicePushToken,
  });

  console.log(expoPushToken);

  if (userId) {
    updateExpoPushToken(userId, expoPushToken);
  }
}

export { registerForPushNotificationsAsync };
