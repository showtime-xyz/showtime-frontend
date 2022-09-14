import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

import { useRouter } from "@showtime-xyz/universal.router";

import { usePreviousValue } from "app/hooks/use-previous-value";
import { isMobileWeb } from "app/utilities";

export const MuteContext = createContext([true, () => {}] as
  | [boolean, Dispatch<SetStateAction<boolean>>]);

export const MuteProvider = ({ children }: { children: any }) => {
  const router = useRouter();
  const values = useState(true);
  const setValue = values[1];

  const prevRouter = usePreviousValue(router);

  useEffect(() => {
    if (
      isMobileWeb() &&
      (prevRouter?.pathname !== router.pathname ||
        prevRouter?.query !== router.query)
    ) {
      setValue(true);
    }
  }, [router, prevRouter?.query, prevRouter?.pathname, setValue]);

  return <MuteContext.Provider value={values}>{children}</MuteContext.Provider>;
};

export const useMuted = () => {
  return useContext(MuteContext);
};
