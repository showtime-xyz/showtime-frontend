import { Dimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { BottomSheetScrollView } from "app/components/bottom-sheet-scroll-view";
import { Carousel } from "app/lib/carousel";

const width = Dimensions.get("window").width;

type ExplanationProps = {
  values: { description?: string; title?: string }[];
  title: string;
  coverElement?: JSX.Element | null;
  onDone: () => void;
  ctaCopy?: string;
  enabled?: boolean;
};

export const Explanation = ({
  values,
  title,
  coverElement,
  onDone,
  ctaCopy,
  enabled,
}: ExplanationProps) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <BottomSheetScrollView>
        {coverElement}
        <View tw="flex-1 items-center justify-center py-4">
          <Text tw="px-8 text-center text-3xl text-gray-900 dark:text-white">
            {title}
          </Text>
          <Carousel
            loop
            width={Math.min(400, width - 64)}
            height={150}
            autoPlay
            data={values}
            autoPlayInterval={2000}
            pagination
            controller
            controllerTw="-top-8 web:-top-20"
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <View
                tw="h-16 bg-white pt-10 dark:bg-black"
                style={{ height: 150 }}
              >
                {item.title && (
                  <>
                    <Text tw="text-center text-2xl text-gray-900 dark:text-white">
                      {item.title}
                    </Text>
                    <View tw="h-4" />
                  </>
                )}
                {item.description && (
                  <>
                    <Text tw="text-center text-lg text-gray-600 dark:text-gray-400">
                      {item.description}
                    </Text>
                  </>
                )}
              </View>
            )}
            enabled={enabled}
          />
        </View>
      </BottomSheetScrollView>
      <View tw="mt-auto w-full px-8" style={{ paddingBottom: insets.bottom }}>
        <Button size="regular" onPress={onDone}>
          {ctaCopy}
        </Button>
      </View>
    </>
  );
};
