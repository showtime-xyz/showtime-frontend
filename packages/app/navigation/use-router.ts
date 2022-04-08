import { useRouter as SolitoRouter } from "solito/router";

export function useRouter() {
  const solitoRouter = SolitoRouter();
  return {
    ...solitoRouter,
    pop: () => {
      solitoRouter.back();
    },
  };
}
