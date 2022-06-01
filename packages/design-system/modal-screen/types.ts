import { ModalProps } from "@showtime-xyz/universal.modal";

export interface ModalScreenOptions extends ModalProps {
  title: string;
  matchingPathname: string;
  matchingQueryParam: string;
  snapPoints?: Array<number | string>;
}
