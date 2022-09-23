import { StyleProp, ViewStyle } from "react-native";

import Animated from "react-native-reanimated";

import { removeTags } from "app/utilities";

import { ClampText } from "design-system/clamp-text";

type Props = {
  descriptionText?: string;
  style?: StyleProp<ViewStyle>;
  maxLines?: number;
};

function Description({ descriptionText = "", style, maxLines = 3 }: Props) {
  if (!descriptionText || descriptionText === "") {
    return null;
  }

  return (
    <Animated.View style={style}>
      <ClampText
        tw="text-sm text-gray-600 dark:text-gray-400"
        maxLines={maxLines}
        text={removeTags(descriptionText)}
      />
    </Animated.View>
  );
}

export { Description };
