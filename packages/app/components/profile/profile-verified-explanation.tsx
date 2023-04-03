import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const ProfileVerifiedExplanation = () => {
  return (
    <View tw="mb-6 justify-center px-4 pt-4">
      <Text tw="text-sm leading-5 text-black dark:text-white">
        Verified Profiles cannot change their display name or username. If you
        need to change it, contact us at help@showtime.xyz.
      </Text>
    </View>
  );
};
