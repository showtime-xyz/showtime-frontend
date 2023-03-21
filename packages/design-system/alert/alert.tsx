import React from "react";

import { Divider } from "design-system/divider";
import { Text } from "design-system/text";
import { View } from "design-system/view";

export type AlertProps = {
  title?: string;
  message?: string;
  renderBtns: JSX.Element | JSX.Element[];
};
export const Alert = ({ title, message, renderBtns }: AlertProps) => {
  return (
    <>
      <Text tw="text-center text-lg font-bold text-gray-900 dark:text-white">
        {title}
      </Text>
      {Boolean(message) && (
        <>
          <View tw="h-4" />
          <Text tw="text-center text-base text-gray-900 dark:text-white">
            {message}
          </Text>
        </>
      )}
      <Divider tw="my-4" />
      {renderBtns}
    </>
  );
};
