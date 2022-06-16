import { View } from "@showtime-xyz/universal.view";

export const SettingBody: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <View tw="items-center">
      <View tw="w-full max-w-screen-xl">{children}</View>
    </View>
  );
};
