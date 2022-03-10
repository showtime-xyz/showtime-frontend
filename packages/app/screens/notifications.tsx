import { withColorScheme } from "app/components/memo-with-theme";
import { Notifications } from "app/components/notifications";

const NotificationsScreen = withColorScheme(() => {
  return <Notifications />;
});

export { NotificationsScreen };
