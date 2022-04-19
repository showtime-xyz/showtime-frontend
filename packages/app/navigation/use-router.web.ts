import { useRouter as useNextRouter } from "next/router";
import { useRouter as useSolitoRouter } from "solito/router";

export function useRouter() {
  const { replace, back, pathname, query, asPath } = useNextRouter();
  const solitoRouter = useSolitoRouter();

  return {
    ...solitoRouter,
    pop: () => {
      if (
        // Check if there is a query param with "modal"
        Object.keys(query ?? {}).some((key) =>
          key.toLowerCase().includes("modal")
        )
      ) {
        replace(asPath, asPath, { shallow: true });
      } else {
        back();
      }
    },
    pathname,
    query,
    asPath,
  };
}
