import { ModalProps } from "@showtime-xyz/universal.modal";

export interface ModalScreenOptions extends ModalProps {
  title: string;
  subtitle?: string;
  matchingPathname: string;
  matchingQueryParam: string;
  snapPoints?: Array<number | string>;
  backPressHandlerEnabled?: boolean;
  onScreenDismiss?: () => void;
}
export type PopCallback = (() => void) | undefined | null;

export type ModalScreenContextValue = {
  setTitle: (title: string) => void;
  setSubtitle?: (subtitle: string) => void;
  pop: (params?: { callback?: PopCallback }) => void;
  snapToIndex: (index: number) => void;
} | null;
