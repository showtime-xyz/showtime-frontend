import * as Burnt from "burnt";
import type {
  ToastOptions as BurntToastOptions,
  AlertOptions as BurntAlertOptions,
} from "burnt/build/types";
import type { ToasterProps } from "react-hot-toast";

import { CustomOption, ValueOrFunction } from "./type";

type ToastOptions = Omit<BurntToastOptions, "title" | "preset" | "duration"> & {
  /**
   * Duration in milliseconds.
   */
  duration?: number;
};

type AlertOptions = Omit<BurntAlertOptions, "title"> & {};

function getPreset<T = string>(title: string, preset: T) {
  return title.length > 28 ? "none" : preset;
}

const toast = (title: string, options?: ToastOptions) => {
  if (typeof options?.duration === "number") {
    options.duration = options.duration / 1000;
  }
  return Burnt.toast({
    title: title,
    preset: "none",
    ...options,
  });
};

toast.error = (title: string, options?: ToastOptions) => {
  if (typeof options?.duration === "number") {
    options.duration = options.duration / 1000;
  }
  return Burnt.toast({
    title: title,
    preset: getPreset(title, "error"),
    haptic: "error",
    ...options,
  });
};
toast.success = (title: string, options?: ToastOptions) => {
  if (typeof options?.duration === "number") {
    options.duration = options.duration / 1000;
  }
  return Burnt.toast({
    title: title,
    preset: getPreset(title, "done"),
    haptic: "success",
    ...options,
  });
};

toast.custom = (title: string, options: CustomOption) => {
  if (typeof options?.duration === "number") {
    options.duration = options.duration / 1000;
  }
  return Burnt.toast({
    title: title,
    preset: "custom",
    icon: {
      ios: options.ios,
    },
    duration: options.duration,
  });
};

toast.dismiss = () => false;

toast.promise = function <T>(
  promise: Promise<T>,
  msgs: {
    loading: string;
    success: ValueOrFunction<string, T>;
    error: ValueOrFunction<string, any>;
  },
  options?: AlertOptions
) {
  if (typeof options?.duration === "number") {
    options.duration = options.duration / 1000;
  }
  Burnt.alert({
    title: msgs.loading,
    preset: "spinner",
    ...(options as any),
  });
  promise
    .then((p) => {
      Burnt.dismissAllAlerts();
      Burnt.alert({
        title: msgs.success,
        preset: "done",
        ...(options as any),
      });
      return p;
    })
    .catch(() => {
      Burnt.dismissAllAlerts();
      Burnt.alert({
        title: msgs.error,
        preset: "error",
        ...(options as any),
      });
    });

  return promise;
};

// eslint-disable-next-line unused-imports/no-unused-vars
const Toaster = (_props: ToasterProps) => <></>;

export { Toaster, toast };
