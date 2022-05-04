import { forwardRef, useMemo } from "react";

import { MotiView, AnimatePresence } from "moti";

import { useIsDarkMode } from "../../hooks";
import { tw } from "../../tailwind";

const DROPDOWN_LIGHT_SHADOW =
  "0px 12px 16px rgba(0, 0, 0, 0.1), 0px 16px 48px rgba(0, 0, 0, 0.1)";
const DROPDOWN_DRAK_SHADOW =
  "0px 0px 2px rgba(255, 255, 255, 0.5), 0px 16px 48px rgba(255, 255, 255, 0.2)";

interface SelectListProps {
  open: boolean;
  children: React.ReactNode;
}

export const SelectList: React.FC<SelectListProps> = forwardRef(
  ({ open, children, ...rest }, ref) => {
    const isDark = useIsDarkMode();
    return (
      <AnimatePresence>
        {open ? (
          <MotiView
            ref={ref}
            from={{
              opacity: 0,
              translateY: -24,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            exit={{
              opacity: 0,
              translateY: -24,
            }}
            transition={{
              type: "timing",
              duration: 250,
            }}
            style={[
              tw`z-20 absolute w-full top-100% p-1 mt-2 bg-white dark:bg-black rounded-2xl`,
              {
                boxShadow: isDark
                  ? DROPDOWN_DRAK_SHADOW
                  : DROPDOWN_LIGHT_SHADOW,
              },
            ]}
            {...rest}
          >
            {children}
          </MotiView>
        ) : null}
      </AnimatePresence>
    );
  }
);
