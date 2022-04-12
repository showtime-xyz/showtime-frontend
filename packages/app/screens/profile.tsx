import { useEffect } from "react";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { ErrorBoundary } from "app/components/error-boundary";
import { withColorScheme } from "app/components/memo-with-theme";
import { Profile } from "app/components/profile";
import { mixpanel } from "app/lib/mixpanel";
import { createParam } from "app/navigation/use-param";

type Query = {
  username: string;
};

const { useParam } = createParam<Query>();

const ProfileScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Profile view");
  }, []);

  const [username] = useParam("username");
  const cleanedUsername = username?.replace(/@/g, "");

  return (
    <BottomSheetModalProvider>
      <ErrorBoundary>
        <Profile username={cleanedUsername as string} />
      </ErrorBoundary>
    </BottomSheetModalProvider>
  );
});

export { ProfileScreen };
