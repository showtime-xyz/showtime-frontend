import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export const MuteContext = createContext([true, () => {}] as
  | [boolean, Dispatch<SetStateAction<boolean>>]);

export const MuteProvider = ({ children }: { children: any }) => {
  const values = useState(true);

  return <MuteContext.Provider value={values}>{children}</MuteContext.Provider>;
};

export const useMuted = () => {
  return useContext(MuteContext);
};
