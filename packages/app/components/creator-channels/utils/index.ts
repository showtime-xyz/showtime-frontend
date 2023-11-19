import { ScaledSize } from "react-native";

import { ChannelMessageAttachment } from "../types";

const LOREM_IPSUM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function seededRandom(seed: number): () => number {
  let currentSeed = seed;
  return () => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };
}

export function randomizeAndReverseText(input: string, seed: number): string {
  const rng = seededRandom(seed);
  const words = input.split(" ");

  const randomizedWords = [...words].sort(() => 0.5 - rng());

  return randomizedWords
    .map((word) => {
      if (rng() > 0.5) {
        return word.split("").reverse().join("");
      }
      return word;
    })
    .join(" ");
}

export function generateLoremIpsum(length: number): string {
  let result = "";
  while (result.length < length) {
    result += " " + LOREM_IPSUM;
  }
  const slicedResult = result.slice(0, length);
  return randomizeAndReverseText(slicedResult, length);
}

type SizeProps = {
  attachment: ChannelMessageAttachment;
  dimensions?: ScaledSize;
};

export const getImageAttachmentWidth = ({
  attachment,
  dimensions,
}: SizeProps) => {
  if (!attachment || !attachment.height || !attachment.width) {
    return 0;
  }

  const aspectRatio = attachment.width / attachment.height;
  const maxWidth = !dimensions ? 250 : dimensions.width;
  const maxHeight = !dimensions ? 250 : dimensions.height - 150;

  // Determine which dimension is the limiting factor (width or height)
  if (maxWidth / aspectRatio <= maxHeight) {
    // Width is the limiting factor
    return maxWidth;
  } else {
    // Height is the limiting factor
    return Math.round(maxHeight * aspectRatio);
  }
};

export const getImageAttachmentHeight = ({
  attachment,
  dimensions,
}: SizeProps) => {
  if (!attachment || !attachment.height || !attachment.width) {
    return 0;
  }

  const aspectRatio = attachment.width / attachment.height;
  const maxWidth = !dimensions ? 250 : dimensions.width;
  const maxHeight = !dimensions ? 250 : dimensions.height - 150;

  // Determine which dimension is the limiting factor (width or height)
  if (maxHeight * aspectRatio <= maxWidth) {
    // Height is the limiting factor
    return maxHeight;
  } else {
    // Width is the limiting factor
    return Math.round(maxWidth / aspectRatio);
  }
};
