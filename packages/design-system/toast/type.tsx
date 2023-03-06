import type { CustomToastOptions } from "burnt/src/types";

export type CustomOption = {
  ios: CustomToastOptions["icon"]["ios"];
  web: JSX.Element | React.ReactNode;
};
