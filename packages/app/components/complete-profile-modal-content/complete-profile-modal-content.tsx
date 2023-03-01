import * as React from "react";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { UserCircle } from "design-system/icon";

type CompleteProfileModalContentProps = {
  title?: string;
  description?: string;
  cta?: string;
  allowSkip?: boolean;
};
export const CompleteProfileModalContent = ({
  title = "Tell creators and collectors who you are!",
  description = "Completing your profile will take around 1 minute.",
  cta = "Complete Profile",
  allowSkip = false,
}: CompleteProfileModalContentProps) => {
  const router = useRouter();
  return (
    <View tw="flex-1  px-10 text-center">
      <View tw="items-center pt-8">
        <UserCircle color={colors.violet[500]} width={100} height={100} />
        <View tw="h-10" />
        <Text tw="text-xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </Text>
        <View tw="h-6" />
        <Text tw="text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
          {description}
        </Text>
      </View>
      <Button
        tw="mt-12"
        size="regular"
        onPress={() => router.push("/profile/edit")}
      >
        {cta}
      </Button>
      {allowSkip && (
        <Button
          size="regular"
          tw="mt-2"
          variant="text"
          onPress={() => router.replace("/")}
        >
          Skip for now
        </Button>
      )}
    </View>
  );
};
