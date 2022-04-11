import { useRouter as useNextRouter } from "next/router";
import { useRouter as SolitoRouter } from "solito/router";

export function useRouter() {
  const { pathname, query, asPath } = useNextRouter();
  const solitoRouter = SolitoRouter();

  return {
    ...solitoRouter,
    pop: () => {
      solitoRouter.back();
    },
    pathname,
    query,
    asPath,
  };
}
