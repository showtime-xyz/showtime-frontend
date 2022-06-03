import { memo } from "react";

import { ShowtimeWordmark } from "@showtime-xyz/universal.icon";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useFooter } from "app/hooks/use-footer";
import { Link } from "app/navigation/link";

export const WebFooter = memo(function WebFooter() {
  const { social, links } = useFooter();
  return (
    <View tw="w-full items-center bg-white dark:bg-black">
      <View tw="w-full max-w-screen-2xl flex-col-reverse justify-between p-4 md:flex-row md:p-12 ">
        <View tw="mt-4 md:mt-0">
          <Link href="/" key="ShowtimeWordmark">
            <ShowtimeWordmark
              color={tw.style("text-gray-900 dark:text-white").color as string}
              height={24}
              width={140}
            />
          </Link>
          <Text tw={"text-13 mt-4 font-semibold text-gray-500"}>
            &copy; {new Date().getFullYear()} Showtime Technologies, Inc.
          </Text>
        </View>
        <View tw="flex flex-row justify-between">
          <View tw="mr-20 flex flex-col">
            {links.map((item) => (
              <Link
                href={item.link}
                hrefAttrs={{
                  target: "_blank",
                  rel: "noreferrer",
                }}
                key={item.title}
              >
                <Text
                  key={item.title}
                  tw="text-13 mb-4 mt-0 font-semibold text-gray-900 dark:text-white"
                >
                  {item.title}
                </Text>
              </Link>
            ))}
          </View>
          <View tw="flex flex-col">
            {social.map((item, i) => (
              <Link
                tw="mb-6 flex-row items-center"
                href={item.link}
                hrefAttrs={{
                  target: "_blank",
                  rel: "noreferrer",
                }}
                key={item.title}
              >
                <View tw="mr-2 text-base">
                  {item.icon({
                    color: tw.style("text-gray-900 dark:text-white")
                      .color as string,
                  })}
                </View>
                <Text tw="text-13 font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </Text>
              </Link>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
});
