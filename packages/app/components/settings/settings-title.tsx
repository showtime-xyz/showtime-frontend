import { Button, ButtonProps } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type Props = {
  title: string;
  titleTw?: string;
  descTw?: string;
  desc?: string | JSX.Element;
  buttonText?: string;
  buttonProps?: ButtonProps;
  onPress?: () => void;
  tw?: string;
};

export const SettingsTitle = ({
  title,
  desc,
  buttonText,
  onPress,
  tw = "",
  titleTw = "text-xl font-bold text-gray-900 dark:text-white",
  descTw = "mt-4",
  buttonProps = {},
}: Props) => {
  return (
    <View tw={["flex p-4 lg:p-0", tw]}>
      <View tw="h-8 flex-row items-center justify-between">
        {Boolean(title) && <Text tw={titleTw}>{title}</Text>}
        {Boolean(buttonText) && (
          <Button
            variant="primary"
            size="small"
            onPress={onPress}
            {...buttonProps}
          >
            {buttonText}
          </Button>
        )}
      </View>
      {Boolean(desc) && (
        <>
          <View tw={descTw}>
            <Text tw="text-sm text-gray-900 dark:text-white">{desc}</Text>
          </View>
        </>
      )}
    </View>
  );
};
