import { Meta } from "@storybook/react";
import { View } from "design-system/view";

import { Button } from "./button";

export default {
  component: Button,
  title: "Components/Card/Social/Button",
} as Meta;

export const Basic: React.VFC<{}> = () => {
  return (
    <View tw="p-1 bg-white dark:bg-black">
      <View tw="flex-row mb-2">
        <Button variant="like" state="default" count={42400} />
        <View tw="ml-2" />
        <Button variant="comment" state="default" count={200} />
        <View tw="ml-2" />
        <Button variant="boost" state="default" count={15} />
      </View>

      <View tw="flex-row mb-2">
        <Button variant="like" state="hover" count={42400} />
        <View tw="ml-2" />
        <Button variant="comment" state="hover" count={200} />
        <View tw="ml-2" />
        <Button variant="boost" state="hover" count={15} />
      </View>

      <View tw="flex-row mb-2">
        <Button variant="like" state="tap" count={42400} active={true} />
        <View tw="ml-2" />
        <Button variant="comment" state="tap" count={200} active={true} />
        <View tw="ml-2" />
        <Button variant="boost" state="tap" count={15} active={true} />
      </View>

      <View tw="flex-row mb-2">
        <Button variant="like" state="disabled" count={42400} disabled={true} />
        <View tw="ml-2" />
        <Button
          variant="comment"
          state="disabled"
          count={200}
          disabled={true}
        />
        <View tw="ml-2" />
        <Button variant="boost" state="disabled" count={15} disabled={true} />
      </View>
    </View>
  );
};
