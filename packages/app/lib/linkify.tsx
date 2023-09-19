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
    /\b(https?:\/\/[^\s]+|www\.[^\s]+|[A-Za-z0-9-]+\.[A-Za-z0-9-]+(?:\/[^\s]+)?(?:\?[^\s]*)?)\b/gi,
    (match, i) => {
      const parsed = parse(match);
      if (parsed.isIcann || match.startsWith("http:")) {
        // Add https:// if not present
        if (!match.startsWith("http://") && !match.startsWith("https://")) {
          match = "https://" + match;
        }

        const urlText = match.replace(/https?:\/\//gi, "");

        // check if the domain is showtime.xyz
        if (parsed.domain === "showtime.xyz") {
          match = match.replace(
            /(www\.|http:\/\/|https:\/\/|showtime\.xyz)/gi,
            ""
          );
        }
        return (
          <TextLink
            href={match}
            key={match + i}
            target="_blank"
            title={urlText}
            // @ts-expect-error TODO: fix this
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
  replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
    <TextLink
      href={`/@${match}`}
      key={match + i}
      target="_blank"
      title="Open profile"
      // @ts-expect-error TODO: fix this
      tw={[
        "text-13 font-bold text-gray-900 dark:text-gray-100",
        tw ? (Array.isArray(tw) ? tw.join(" ") : tw) : "",
      ]}
    >
      @{match}
    </TextLink>
  ));

  return replacedText;
};

export const containsURL = (text?: string) => {
  if (!text) {
    return false;
  }

  let foundURL = false;

  reactStringReplace(
    text,
    /\b(https?:\/\/[^\s]+|ftps?:\/\/|wss?:\/\/www\.[^\s]+|[A-Za-z0-9-]+\.[A-Za-z0-9-]+(?:\/[^\s]+)?(?:\?[^\s]*)?)\b/gi,
    (match) => {
      const parsed = parse(match);
      if (parsed.isIcann || match.startsWith("http:")) {
        foundURL = true;
      } else if (
        match.startsWith("ftp:") ||
        match.startsWith("ftps:") ||
        match.startsWith("ws:") ||
        match.startsWith("wss:")
      ) {
        foundURL = true;
      }
      return match;
    }
  );

  return foundURL;
};
