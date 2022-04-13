import { useRouter as useNextRouter } from "next/router";
import { useRouter as useSolitoRouter } from "solito/router";

export function useRouter() {
  const { pathname, query, asPath } = useNextRouter();
  const solitoRouter = useSolitoRouter();

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
