import "./dot.css";
import { DotAnimationProps } from "./type";

export const DotAnimation = ({
  color = "#000",
  size = 2,
  spacing = 2,
}: DotAnimationProps) => {
  return (
    <>
      {new Array(3).fill(0).map((_, index) => (
        <span
          className={`dot-animation dot-animation-${index + 1}`}
          key={index}
          style={{
            width: size,
            height: size,
            borderRadius: size,
            marginLeft: spacing,
            backgroundColor: color,
          }}
        />
      ))}
    </>
  );
};
