import type { CustomToastOptions } from "burnt/src/types";

export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;
export type ValueOrFunction<TValue, TArg> =
  | TValue
  | ValueFunction<TValue, TArg>;

export type CustomOption = {
  ios: CustomToastOptions["icon"]["ios"];
  web: JSX.Element | React.ReactNode;
  duration?: number;
};
