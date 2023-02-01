import { View } from "@showtime-xyz/universal.view";

export const SlotSeparator = ({ tw = "" }: { tw?: string }) => (
  <View tw={["h-px bg-gray-200 dark:bg-gray-800", tw]} />
);
