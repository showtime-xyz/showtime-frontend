import reactStringReplace from "react-string-replace";

import { TextLink } from "app/navigation/link";

// This function replaces mention tags (@showtime) and URL (http://) with Link components
export const linkifyDescription = (text?: string) => {
  if (!text) {
    return null;
  }
  // Match @-mentions
  let replacedText = reactStringReplace(text, /@(\w+)/g, (match, i) => {
    return (
      <TextLink
        href={`/@${match}`}
        key={match + i}
        target="_blank"
        tw="text-13 font-bold text-gray-900 dark:text-gray-100"
      >
        @{match}
      </TextLink>
    );
  });
  // Match URLs
  replacedText = reactStringReplace(
    replacedText,
    /(https?:\/\/\S+)/g,
    (match, i) => (
      <TextLink
        href={match}
        key={match + i}
        target="_blank"
        tw="text-13 font-bold text-gray-900 dark:text-gray-100"
      >
        {match}
      </TextLink>
    )
  );

  return replacedText;
};
