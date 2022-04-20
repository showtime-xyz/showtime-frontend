import { useWindowDimensions } from "react-native";

import { Link } from "app/navigation/link";

import { Text } from "design-system";
import ShowtimeWordmark from "design-system/icon/ShowtimeWordmark";
import { tw } from "design-system/tailwind";
import { View } from "design-system/view";

import { useFooter } from "../hooks/use-footer";

const Footer = () => {
  const {} = useWindowDimensions();
  const { social, links } = useFooter();
  return (
    <View tw="flex-col-reverse justify-between max-w-screen-2xl md:flex-row p-4 md:p-12 bg-white dark:bg-black">
      <View tw="mt-4 md:mt-0">
        <Link href="/">
          <ShowtimeWordmark
            color={tw.style("text-gray-900 dark:text-white").color as string}
            height={24}
            width={140}
          />
        </Link>
        <Text variant="text-13" tw={"text-gray-500 font-semibold mt-4"}>
          &copy; {new Date().getFullYear()} Showtime Technologies, Inc.
        </Text>
      </View>
      <View tw="justify-between flex flex-row">
        <View tw="flex flex-col mr-20">
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
                tw="mb-4 font-semibold text-gray-900 dark:text-white mt-0"
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
              tw="flex-row items-center mb-4"
              href={item.link}
              hrefAttrs={{
                target: "_blank",
                rel: "noreferrer",
              }}
              key={item.title}
            >
              <View tw="text-base mr-2">
                {item.icon({
                  color: tw.style("text-gray-900 dark:text-white")
                    .color as string,
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
  );
};

export { Footer };
