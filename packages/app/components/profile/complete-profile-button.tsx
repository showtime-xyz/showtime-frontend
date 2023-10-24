import { Button, GradientButton } from "@showtime-xyz/universal.button";

import { useRedirectToCreateDrop } from "app/hooks/use-redirect-to-create-drop";
import { useUser } from "app/hooks/use-user";

export const CompleteProfileButton = ({ isSelf }: { isSelf: boolean }) => {
  const { isIncompletedProfile } = useUser();
  const redirectToCreateDrop = useRedirectToCreateDrop();
  if (!isSelf) return null;
  if (isIncompletedProfile) {
    return (
      <GradientButton
        size="small"
        onPress={redirectToCreateDrop}
        labelTW={"color-white"}
        style={{ height: 28, paddingVertical: 0 }}
        gradientProps={{
          colors: ["#ED0A25", "#ED0ABB"],
          locations: [0, 1],
          start: { x: 1.0263092128417304, y: 0.5294252532614323 },
          end: { x: -0.02630921284173038, y: 0.4705747467385677 },
        }}
      >
        Complete profile
      </GradientButton>
    );
  }
  return (
    <Button
      size="small"
      variant="outlined"
      style={{ height: 26, paddingVertical: 0 }}
      tw="py-0"
      onPress={redirectToCreateDrop}
    >
      Edit
    </Button>
  );
};
