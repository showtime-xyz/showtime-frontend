import { StyleProp, ViewStyle } from "react-native";

import { ClampText } from "@showtime-xyz/universal.clamp-text";
import { View, ViewProps } from "@showtime-xyz/universal.view";

import { removeTags } from "app/utilities";

type Props = ViewProps & {
  descriptionText?: string;
  style?: StyleProp<ViewStyle>;
  maxLines?: number;
};

function Description({ descriptionText = "", maxLines = 3, ...rest }: Props) {
  if (!descriptionText || descriptionText === "") {
    return null;
  }

  return (
    <View {...rest}>
      <ClampText
        tw="text-sm text-gray-600 dark:text-gray-400"
        maxLines={maxLines}
        text={removeTags(descriptionText)}
      />
    </View>
  );
}

export { Description };
