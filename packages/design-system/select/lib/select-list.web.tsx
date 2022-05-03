import { forwardRef, useMemo } from "react";

import { MotiView, AnimatePresence } from "moti";

import { getDropdownShadow } from "app/utilities";

import { useIsDarkMode } from "../../hooks";
import { tw } from "../../tailwind";

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
              { boxShadow: getDropdownShadow(isDark) } as {},
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
