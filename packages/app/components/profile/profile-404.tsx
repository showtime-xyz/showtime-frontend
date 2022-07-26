import { memo } from "react";

import { Text } from "@showtime-xyz/universal.text";

import { View } from "design-system";

import { TextLink } from "../../navigation/link";
import { EmptyPlaceholder } from "../empty-placeholder";

export const Profile404 = memo(function ProfilResult() {
  return (
    <View tw="items-center justify-center px-4 pt-8">
      <EmptyPlaceholder
        title="This user does not exist."
        text={
          <Text tw="text-center">
            Try searching for another one or check the link.&nbsp;
            <TextLink href={`/`} tw="text-indigo-500">
              Go Home
            </TextLink>
          </Text>
        }
      />
    </View>
  );
});
