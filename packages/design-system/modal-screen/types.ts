import { ModalProps } from "@showtime-xyz/universal.modal";

export interface ModalScreenOptions extends ModalProps {
  title: string;
  matchingPathname: string;
  matchingQueryParam: string;
  snapPoints?: Array<number | string>;
  backPressHandlerEnabled?: boolean;
}
export type PopCallback = (() => void) | undefined | null;

export type ModalScreenContextValue = {
  setTitle: (title: string) => void;
  pop: (params?: { callback?: PopCallback }) => void;
} | null;
