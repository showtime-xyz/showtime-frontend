import { MotiView } from "moti";
import { forwardRef, useMemo } from "react";
import { tw } from "../../tailwind";

interface SelectListProps {
  open: boolean;
}

export const SelectList: React.FC<SelectListProps> = forwardRef(
  ({ open, children, ...rest }, ref) => {
    const containerStyle = useMemo(
      () => tw`z-20	absolute w-full top-100% p-1 mt-2 bg-white dark:bg-black rounded-2xl`,
      []
    );
    return open ? (
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
        style={containerStyle}
        {...rest}
      >
        {children}
      </MotiView>
    ) : null;
  }
);
