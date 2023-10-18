import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const MyCollection = () => {
  const router = useRouter();
  return (
    <View tw="mt-4">
      <View tw="flex-row items-center justify-between">
        <Text tw="text-13 font-bold text-gray-900 dark:text-white">
          My collection
        </Text>
        <Text
          tw="text-xs font-semibold text-gray-500 dark:text-gray-500"
          onPress={() => {
            // router.push("/profile/collection");
          }}
        >
          Show all
        </Text>
      </View>
      <View tw="mb-2 mt-4 rounded-xl border border-gray-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <View tw="items-center gap-2">
          <View tw="w-full flex-row items-center justify-between">
            <View tw="flex-row items-center">
              <Text tw="mr-2 text-gray-500 dark:text-gray-300">
                Collection value
              </Text>
            </View>
            <Text tw="text-base font-bold text-gray-900 dark:text-white">
              $224.15
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
