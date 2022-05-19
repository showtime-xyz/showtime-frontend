import { ModalProps } from "../modal/types";

export interface ModalScreenOptions extends ModalProps {
  title: string;
  matchingPathname: string;
  matchingQueryParam: string;
  snapPoints?: Array<number | string>;
}
