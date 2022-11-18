import reactStringReplace from "react-string-replace";
import { Link } from "solito/link";

import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type Props = {
  onUserMentionPress?: any;
};

// This function replaces mention tags (@showtime) and URL (http://) with Link components
export const linkifyDescription = (text?: string, rest?: Props) => {
  if (!text) {
    return null;
  }
  // Match @-mentions
  let replacedText = reactStringReplace(text, /@(\w+)/g, (match, i) => {
    return (
      <Link
        key={match + i}
        href={`/@${match}`}
        viewProps={{
          //@ts-ignore. This will only work on native.
          onPress: rest?.onUserMentionPress,
        }}
        target="_blank"
      >
        <Text tw="text-13 font-bold text-gray-900 dark:text-gray-100">
          @{match}
        </Text>
      </Link>
    );
  });
  // Match URLs
  replacedText = reactStringReplace(
    replacedText,
    /(https?:\/\/\S+)/g,
    (match, i) => (
      <Link key={match + i} href={match} target="_blank">
        <View tw="flex-row">
          <Text tw="text-13 wrap flex-shrink-1 font-bold text-gray-900 dark:text-gray-100">
            {match}
          </Text>
        </View>
      </Link>
    )
  );

  return replacedText;
};
