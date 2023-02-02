import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type Props = {
  title: string;
  desc?: string;
  buttonText?: string;
  onPress?: () => void;
  tw?: string;
};

export const SettingsTitle = ({
  title,
  desc,
  buttonText,
  onPress,
  tw = "",
}: Props) => {
  return (
    <View tw={["flex p-4 md:p-0", tw]}>
      <View tw="flex-row items-center justify-between">
        {Boolean(title) && (
          <Text tw="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </Text>
        )}
        {Boolean(buttonText) && (
          <Button variant="primary" size="small" onPress={onPress}>
            {buttonText}
          </Button>
        )}
      </View>
      {Boolean(desc) && (
        <>
          <View tw="h-6" />
          <Text tw="text-sm text-gray-900 dark:text-white">{desc}</Text>
        </>
      )}
    </View>
  );
};
