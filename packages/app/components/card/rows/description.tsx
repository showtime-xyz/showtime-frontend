import { useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { linkifyDescription } from "app/lib/linkify";
import { removeTags } from "app/utilities";

type Props = ViewProps & {
  descriptionText?: string;
  style?: StyleProp<ViewStyle>;
  maxLines?: number;
};

function Description({ descriptionText = "", maxLines = 3, ...rest }: Props) {
  const description = useMemo(
    () =>
      descriptionText ? linkifyDescription(removeTags(descriptionText)) : "",
    [descriptionText]
  );

  if (!descriptionText || descriptionText === "") {
    return null;
  }

  return (
    <View {...rest}>
      <ClampText
        tw="text-sm text-gray-600 dark:text-gray-400"
        maxLines={maxLines}
        text={description}
      />
    </View>
  );
}

export { Description };
