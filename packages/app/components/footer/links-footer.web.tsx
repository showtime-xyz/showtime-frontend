import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import { ShowtimeWordmark } from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";
import { colors } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useFooter } from "app/hooks/use-footer";
import { HIDE_LINK_FOOTER_ROUTER_LIST } from "app/lib/constants";
import { Link } from "app/navigation/link";

export const WebFooter = () => {
  const isDark = useIsDarkMode();
  const { social, links } = useFooter();
  const router = useRouter();

  if (HIDE_LINK_FOOTER_ROUTER_LIST.includes(router.pathname)) {
    return null;
  }

  return (
    <View tw="w-full items-center bg-white dark:bg-black">
      <View tw="w-full max-w-screen-2xl flex-col-reverse justify-between p-4 md:flex-row md:p-12 ">
        <View tw="mt-4 md:mt-0">
          <Link href="/" tw="mb-4" key="ShowtimeWordmark">
            <ShowtimeWordmark
              color={isDark ? "#FFF" : colors.gray[900]}
              height={24}
              width={140}
            />
          </Link>
          <Text tw="text-13 font-semibold text-gray-500">
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
                  tw="text-13 pb-4 font-semibold text-gray-900 dark:text-white"
                >
                  {item.title}
                </Text>
              </Link>
            ))}
          </View>
          <View tw="flex flex-col">
            {social.map((item) => (
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
                  {item?.icon({
                    color: isDark ? "#FFF" : colors.gray[900],
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
};
