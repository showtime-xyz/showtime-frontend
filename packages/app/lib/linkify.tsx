import reactStringReplace from "react-string-replace";
import { parse } from "tldts";

import { TW } from "@showtime-xyz/universal.tailwind";

import { TextLink } from "app/navigation/link";
import { shortenLongWords } from "app/utilities";

// This function replaces mention tags (@showtime) and URL (http://) with Link components

export const linkifyDescription = (text?: string, tw?: TW) => {
  if (!text) {
    return "";
  }

  // First, match URLs
  let replacedText = reactStringReplace(
    text,
    /\b(https?:\/\/\S+|www\.\S+|\b[A-Za-z0-9-]+\.[A-Za-z0-9-.]+(?:\/\S*)?\b)/gi,
    (match, i) => {
      const parsed = parse(match);

      if (parsed.isIcann || match.startsWith("http:")) {
        // Add https:// if not present
        if (!match.startsWith("http://") && !match.startsWith("https://")) {
          match = "https://" + match;
        }

        const urlText = match.replace(/https?:\/\//gi, "");

        return (
          <TextLink
            href={match.toLowerCase()}
            key={match + i}
            target="_blank"
            title={urlText}
            tw={[
              "text-13 font-bold text-gray-900 dark:text-gray-100",
              tw ? (Array.isArray(tw) ? tw.join(" ") : tw) : "",
            ]}
          >
            {shortenLongWords(urlText)}
          </TextLink>
        );
      } else {
        // If not a valid URL, return the original text
        return match;
      }
    }
  );

  // Then, match @-mentions
  replacedText = reactStringReplace(
    replacedText,
    /(?<!\/)@(\w+)/g,
    (match, i) => {
      return (
        <TextLink
          href={`/@${match}`}
          key={match + i}
          target="_blank"
          title="Open profile"
          tw={[
            "text-13 font-bold text-gray-900 dark:text-gray-100",
            tw ? (Array.isArray(tw) ? tw.join(" ") : tw) : "",
          ]}
        >
          @{match}
        </TextLink>
      );
    }
  );

  return replacedText;
};
