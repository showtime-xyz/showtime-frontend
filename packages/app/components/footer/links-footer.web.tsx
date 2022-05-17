import { useFooter } from "app/hooks/use-footer";
import { Link } from "app/navigation/link";

import { Text } from "design-system";
import { useIsDarkMode } from "design-system/hooks";
import ShowtimeWordmark from "design-system/icon/ShowtimeWordmark";
import { colors } from "design-system/tailwind/colors";
import { View } from "design-system/view";

export const WebFooter = () => {
  const isDark = useIsDarkMode();
  const { social, links } = useFooter();

  return (
    <View tw="w-full items-center bg-white dark:bg-black">
      <View tw="w-full max-w-screen-2xl flex-col-reverse justify-between p-4 md:flex-row md:p-12 ">
        <View tw="mt-4 md:mt-0">
          <Link href="/">
            <ShowtimeWordmark
              color={isDark ? "#fff" : colors.gray["900"]}
              height={24}
              width={140}
            />
          </Link>
          <Text variant="text-13" tw={"mt-4 font-semibold text-gray-500"}>
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
                  tw="mb-4 mt-0 font-semibold text-gray-900 dark:text-white"
                  variant="text-13"
                >
                  {item.title}
                </Text>
              </Link>
            ))}
          </View>
          <View tw="flex flex-col">
            {social.map((item) => (
              <Link
                tw="mb-4 flex-row items-center"
                href={item.link}
                hrefAttrs={{
                  target: "_blank",
                  rel: "noreferrer",
                }}
                key={item.title}
              >
                <View tw="mr-2 text-base">
                  {item.icon({
                    color: isDark ? "#fff" : colors.gray["900"],
                  })}
                </View>
                <Text
                  variant="text-13"
                  tw="font-semibold text-gray-900 dark:text-white"
                >
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
