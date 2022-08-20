import { View } from "@showtime-xyz/universal.view";

import { removeTags } from "app/utilities";

import { ClampText } from "design-system/clamp-text";

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
      <ClampText
        tw="text-sm text-gray-600 dark:text-gray-400"
        numberOfLines={maxLines}
        text={removeTags(descriptionText)}
      />
    </View>
  );
}

export { Description };
