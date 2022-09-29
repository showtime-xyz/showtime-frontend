import { Platform } from "react-native";

import * as Application from "expo-application";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { axios } from "app/lib/axios";

const PlatformExpo = 1;
const PlatformWeb = 2;
const PlatformIos = 3;
const PlatformAndroid = 4;

async function getNotificationPermissionStatus() {
  const status = await Notifications.getPermissionsAsync();
  return status.granted; // || status.ios ? status.ios.status === 3 : false;
}

async function registerForPushNotificationsAsync() {
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

  const experienceId = "@showtime-xyz/showtime";
  const applicationId = Application.applicationId;

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

  // Save the device token to the database
  await axios({
    url: `/v1/notifications/device/token`,
    method: "POST",
    data: {
      platform:
        devicePushToken.type === "web" && Platform.OS === "web"
          ? PlatformWeb
          : devicePushToken.type === "ios" && Platform.OS === "ios"
          ? PlatformIos
          : devicePushToken.type === "android" && Platform.OS === "android"
          ? PlatformAndroid
          : 0,
      token: devicePushToken.data,
    },
  });

  // Get the expo token
  const expoPushToken = await Notifications.getExpoPushTokenAsync({
    experienceId,
    applicationId,
    devicePushToken,
  });
  console.log(expoPushToken);

  // Save the expo token to the database
  await axios({
    url: `/v1/notifications/device/token`,
    method: "POST",
    data: {
      platform: PlatformExpo,
      token: expoPushToken.data,
    },
  });
}

export { registerForPushNotificationsAsync };
