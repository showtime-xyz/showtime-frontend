import { useRef, createContext, useMemo, useContext } from "react";

import {
  useWorkletCallback,
  SharedValue,
  AnimatedRef,
  useSharedValue,
} from "react-native-reanimated";

export type Measurements = {
  pageX: number;
  pageY: number;
  width: number;
  height: number;
} | null;

export enum SETState {
  idle,
  targetRendered,
  canAnimate,
  animating,
  animatingOfTheScreen,
  animated,
}

export type SharedElementRegistryItem = {
  origin: AnimatedRef<any>;
  target: AnimatedRef<any>;
  originMeasurements: SharedValue<Measurements | null>;
  targetMeasurements: SharedValue<Measurements | null>;
  progress: SharedValue<number>;
  originExtraStyles?: SharedValue<ExtraStyles>;
  state: SharedValue<SETState>;
};

export type ExtraStyles = {
  rotation?: number | SharedValue<number>;
  borderRadius?: number | SharedValue<number>;
  scale?: number | SharedValue<number>;
};

const registryMap = new Map<string, SharedElementRegistryItem>();

type SharedElementContextType = {
  registryMap: Map<string, SharedElementRegistryItem>;
  hideActive: (onEnd?: (tag?: string) => void) => void;
  registerActiveElement: (
    tag: string,
    callback: (onEnd: (tag: string) => void) => void
  ) => void;
  unregisterActiveElement: (tag: string) => void;
  hasActiveElements: boolean;
  setIsActiveTransition: (isActive: boolean) => void;
  activeTagsCount: SharedValue<number>;
};

const SharedElementContext = createContext<SharedElementContextType | null>(
  null
);

export const SharedElementProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const activeTagsCount = useSharedValue(0);

  const activeElements = useRef<
    {
      tag: string;
      callback: (onEnd: (tag: string) => void) => void;
    }[]
  >([]);

  const setIsActiveTransition = useWorkletCallback((isActive: boolean) => {
    activeTagsCount.value += isActive ? 1 : -1;
  });

  const value = useMemo(
    () => ({
      registryMap,
      registerActiveElement: (
        tag: string,
        callback: (onEnd: (tag: string) => void) => void
      ) => {
        activeElements.current.push({
          tag,
          callback,
        });
      },
      unregisterActiveElement: (tag: string) => {
        const index = activeElements.current.findIndex(
          (item) => item.tag === tag
        );
        if (index !== -1) {
          activeElements.current.splice(index, 1);
        }
      },
      hideActive: (
        onEnd?: (tag?: string) => void,
        alwaysCallOnEnd: boolean = true
      ) => {
        if (activeElements.current.length === 0 && alwaysCallOnEnd) {
          onEnd?.();
        } else {
          const activeElementsCopy = [...activeElements.current];
          activeElements.current = [];
          activeElementsCopy.forEach((item) => item.callback(onEnd!));
        }
      },
      get hasActiveElements() {
        return activeElements.current.length > 0;
      },

      setIsActiveTransition,
      activeTagsCount,
    }),
    [setIsActiveTransition, activeTagsCount]
  );

  return (
    <SharedElementContext.Provider value={value}>
      {children}
    </SharedElementContext.Provider>
  );
};

export const useSharedElementContext = () => {
  const context = useContext(SharedElementContext);
  if (!context)
    throw new Error(
      "useSharedElementContext must be used within a SharedElementProvider"
    );
  return context;
};
