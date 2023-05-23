import { useCallback, useMemo, useRef } from "react";

import { useInfiniteListQuerySWR } from "app/hooks/use-infinite-list-query";

const PAGE_SIZE = 10;

const totalData = new Array(Number(Math.random().toFixed(2)) * 1000)
  .fill(0)
  .map((_, i) => ({
    username: "nishan",
    id: i,
    text: i + 1 + ". " + randomSentenceGenerator(10, 50),
  }));

export const useChannelMessages = () => {
  let indexRef = useRef(0);
  // TODO: add real endpoint
  const messagesUrl = useCallback((index: number, previousPageData: []) => {
    if (previousPageData && !previousPageData.length) return null;
    indexRef.current = index;
    return `/v1/payments?page=${index + 1}&limit=${PAGE_SIZE}`;
  }, []);

  const queryState = useInfiniteListQuerySWR<typeof totalData>(
    messagesUrl,
    {
      pageSize: PAGE_SIZE,
    },
    () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            totalData.slice(
              indexRef.current * PAGE_SIZE,
              (indexRef.current + 1) * PAGE_SIZE
            )
          );
        }, 500);
      });
    }
  );
  const newData = useMemo(() => {
    let newData: typeof totalData = [];
    if (queryState.data) {
      queryState.data.forEach((p) => {
        if (p) {
          newData = newData.concat(p);
        }
      });
    }
    return newData;
  }, [queryState.data]);

  return {
    ...queryState,
    data: [],
  };
};

function getRandomWord() {
  const words =
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(
      " "
    );
  return words[Math.floor(Math.random() * words.length)];
}

function randomSentenceGenerator(minWords: number, maxWords: number) {
  const sentenceLength =
    Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let sentence = "";

  for (let i = 0; i < sentenceLength; i++) {
    sentence += getRandomWord() + " ";
  }

  // Capitalize the first letter and add a period at the end
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1).trim() + ".";

  return sentence;
}
