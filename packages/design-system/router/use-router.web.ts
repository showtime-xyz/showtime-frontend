import { useRouter as useNextRouter } from "next/router";
import { useRouter as useSolitoRouter } from "solito/router";

export function useRouter() {
  const { replace, back, pathname, query, asPath } = useNextRouter();
  const solitoRouter = useSolitoRouter();

  // Check if there is a query param with "Modal"
  const modal = Object.keys(query ?? {}).find((key) => key.includes("Modal"));

  return {
    ...solitoRouter,
    pop: () => {
      if (modal) {
        // Sometimes we open a modal and we also update the URL to match the
        // modal name. Example: /nft/id/details
        const modalName = modal.split("Modal")[0];
        const shouldRemoveModalNameFromAsPath = asPath.includes(modalName);

        const as = shouldRemoveModalNameFromAsPath
          ? asPath.split("/").slice(0, -1).join("/")
          : asPath;

        replace(as, as, { shallow: true });
      } else {
        back();
      }
    },
    pathname,
    query,
    asPath,
  };
}
