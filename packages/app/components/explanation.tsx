import { useState, useEffect, useRef } from "react";

import { MotiView } from "moti";

import { Button } from "@showtime-xyz/universal.button";
import { useSafeAreaInsets } from "@showtime-xyz/universal.safe-area";
import { ScrollView } from "@showtime-xyz/universal.scroll-view";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

type ExplanationProps = {
  values: { description?: string; title?: string }[];
  title: string;
  coverElement?: JSX.Element | null;
  onDone: () => void;
  ctaCopy?: string;
};
export const Explanation = ({
  values,
  title,
  coverElement,
  onDone,
  ctaCopy,
}: ExplanationProps) => {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const timerRef = useRef<null | NodeJS.Timer>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % values.length);
    }, 3000);
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [values.length]);

  return (
    <>
      <ScrollView>
        {coverElement}
        <View tw="flex-1 p-8">
          <Text tw="text-center text-3xl text-gray-900 dark:text-white">
            {title}
          </Text>
          <View tw="mt-10 flex-row justify-center">
            {new Array(values.length).fill(0).map((v, i) => {
              return (
                <View
                  key={i}
                  tw={`rounded-full bg-gray-${
                    i === page ? 400 : 200
                  } dark:bg-gray-${i === page ? 100 : 500} h-2 w-2 ${
                    i > 0 ? "ml-2" : ""
                  }`}
                />
              );
            })}
          </View>
          <MotiView
            from={{ opacity: 0 }}
            transition={{ duration: 600, type: "timing" }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: 40,
              height: 64,
            }}
          >
            {values[page].title && (
              <>
                <Text tw="text-center text-2xl text-gray-900 dark:text-white">
                  {values[page].title}
                </Text>
                <View tw="h-4" />
              </>
            )}
            {values[page].description && (
              <>
                <Text tw="text-center text-lg text-gray-600 dark:text-gray-400">
                  {values[page].description}
                </Text>
              </>
            )}
          </MotiView>
        </View>
      </ScrollView>
      <View tw="mt-auto w-full px-8 " style={{ paddingBottom: insets.bottom }}>
        <Button size="regular" onPress={onDone}>
          {ctaCopy}
        </Button>
      </View>
    </>
  );
};
