import { Text, View } from "design-system";

export const SettingHeaderSection = ({ title = "" }) => {
  return (
    <View tw="items-center bg-white dark:bg-black">
      <View tw="w-full max-w-screen-2xl flex-row justify-between bg-white py-4 px-4 dark:bg-black">
        <Text tw="font-space-bold text-2xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </Text>
      </View>
    </View>
  );
};
