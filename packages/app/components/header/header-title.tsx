import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

const titleMap = new Map([
  ["/notifications", "Notifications"],
  ["/trending", "Trending"],
]);

export const HeaderTitle = () => {
  const router = useRouter();
  const pathname = router?.pathname;
  const title = titleMap.get(pathname);
  if (!title) {
    return null;
  }
  return (
    <View tw="flex-row items-center justify-center">
      <Text tw="text-base font-bold text-black dark:text-white">{title}</Text>
    </View>
  );
};
