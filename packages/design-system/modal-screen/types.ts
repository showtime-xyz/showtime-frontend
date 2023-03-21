import { ModalProps } from "design-system/modal";

export interface ModalScreenOptions extends ModalProps {
  title: string;
  matchingPathname: string;
  matchingQueryParam: string;
  snapPoints?: Array<number | string>;
  backPressHandlerEnabled?: boolean;
}
