import { useMemo } from "react";

import { Toaster as RHToaster, toast } from "react-hot-toast";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

const defaultStyle = {
  fontSize: 16,
  fontWeight: 600,
  padding: 16,
  borderRadius: 16,
};
const Toaster = () => {
  const isDark = useIsDarkMode();
  const toastOptions = useMemo(() => {
    return {
      style: {
        ...defaultStyle,
        ...(isDark
          ? {
              background: "#000",
              color: "#fff",
              boxShadow:
                "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 16px 48px rgba(255, 255, 255, 0.2)",
            }
          : {
              color: "#18181B",
              background: "#fff",
              boxShadow:
                "0px 12px 16px rgba(0, 0, 0, 0.1), 0px 16px 48px rgba(0, 0, 0, 0.1)",
            }),
      },
    };
  }, [isDark]);
  return <RHToaster toastOptions={toastOptions} />;
};

toast.custom = (message: any, options?: any): string => {
  return toast(message, {
    icon: options.web,
    duration: options?.duration,
  });
};
export { Toaster, toast };
