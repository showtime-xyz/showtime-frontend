import { useEffect } from "react";

import { mixpanel } from "app/lib/mixpanel";
import { Feed } from "app/components/feed";
import { useAllActivity } from "app/hooks/service-hooks";

const HomeScreen = () => {
  useEffect(() => {
    mixpanel.track("Home page view");
  }, []);

  const { isLoading, onRefresh, size, activity, getNext, isRefreshing } =
    useAllActivity();

  return (
    <Feed
      activity={activity}
      activityPage={size}
      getNext={getNext}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );
};

export { HomeScreen };
