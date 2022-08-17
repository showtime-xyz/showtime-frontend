import { View } from "@showtime-xyz/universal.view";

import { MultiClampText } from "design-system/multi-clamp-text";

type Props = {
  descriptionText?: string;
  tw?: string;
  maxLines?: number;
};

function Description({ descriptionText = "", tw, maxLines = 3 }: Props) {
  if (!descriptionText || descriptionText === "") {
    return null;
  }

  return (
    <View tw={tw}>
      <MultiClampText
        tw="text-sm text-gray-600 dark:text-gray-400"
        numberOfLines={maxLines}
        text={descriptionText}
      />
    </View>
  );
}

export { Description };
