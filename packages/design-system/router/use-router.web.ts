import { useMemo } from "react";

import { useRouter as useNextRouter } from "next/router";
import type { NextRouter } from "next/router";
import { useRouter as useSolitoRouter } from "solito/router";

interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
}

export function useRouter() {
  const nextRouter = useNextRouter();
  const solitoRouter = useSolitoRouter();

  return useMemo(() => {
    return {
      ...solitoRouter,
      push: (
        url: Parameters<NextRouter["push"]>[0],
        as?: Parameters<NextRouter["push"]>[1],
        options?: TransitionOptions | undefined
      ) =>
        solitoRouter.push(url, as, {
          ...options,
          scroll: false,
        }),
      pop: () => {
        // Check if there is a query param with "Modal"
        const modal = Object.keys(nextRouter.query ?? {}).find((key) =>
          key.includes("Modal")
        );
        if (modal) {
          // Sometimes we open a modal and we also update the URL to match the
          // modal name. Example: /nft/id/details
          const modalName = modal.split("Modal")[0];
          const shouldRemoveModalNameFromAsPath =
            nextRouter.asPath.includes(modalName);

          const as = shouldRemoveModalNameFromAsPath
            ? nextRouter.asPath.split("/").slice(0, -1).join("/")
            : nextRouter.asPath;

          nextRouter.replace(as, as, { shallow: true, scroll: false });
        } else {
          nextRouter.back();
        }
      },
      pathname: nextRouter.pathname,
      query: nextRouter.query,
      asPath: nextRouter.asPath,
    };
  }, [nextRouter, solitoRouter]);
}
