import { DotAnimationProps } from "./type";

export const ThreeDotsAnimation = ({
  color = "#000",
  size = 2,
  spacing = 2,
}: DotAnimationProps) => {
  return (
    <>
      {new Array(3).fill(0).map((_, index) => (
        <span
          className="relative inline-block animate-pulse opacity-0"
          key={index}
          style={{
            width: size,
            height: size,
            borderRadius: size,
            marginLeft: spacing,
            backgroundColor: color,
            animationDelay: `${(index + 1) * 200}ms`,
          }}
        />
      ))}
    </>
  );
};
