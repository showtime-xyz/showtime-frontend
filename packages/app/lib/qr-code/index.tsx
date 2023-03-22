import React, { useMemo, useCallback } from "react";

import Svg, {
  Defs,
  Rect,
  ClipPath,
  Circle,
  G,
  Path,
  Image,
} from "react-native-svg";

import { useIsDarkMode } from "@showtime-xyz/universal.hooks";

import { QRCodeProps } from "./type";
import { genMatrix } from "./utils";

export const ReactQRCode = ({
  value = "this is a QR code",
  size = 100,
  backgroundColor,
  logo,
  logoSize = size * 0.2,
  logoBackgroundColor = "transparent",
  logoMargin = 2,
  ecl = "L",
  fillColors: propsFillColors,
}: QRCodeProps) => {
  const isDark = useIsDarkMode();

  const fillColors = useMemo(() => {
    if (propsFillColors) {
      return propsFillColors;
    }
    return isDark ? ["black", "white"] : ["white", "black"];
  }, [isDark, propsFillColors]);

  const fillColor = fillColors[1];

  const getFill = useCallback(
    (isOdd: boolean) => {
      return fillColors[isOdd ? 0 : 1];
    },
    [fillColors]
  );
  const dots = useMemo(() => {
    const result: JSX.Element[] = [];
    const matrix = genMatrix(value, ecl);
    const cellSize = size / matrix.length;
    let qrPositonList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];

    qrPositonList.forEach(({ x, y }, index) => {
      const x1 = (matrix.length - 7) * cellSize * x;
      const y1 = (matrix.length - 7) * cellSize * y;
      for (let i = 0; i < 3; i++) {
        result.push(
          <Rect
            fill={getFill(i % 2 !== 0)}
            height={cellSize * (7 - i * 2)}
            rx={(i - 3) * -(size * 0.02) + (i === 0 ? size * 0.01 : 0)} // calculated border radius for corner squares
            ry={(i - 3) * -(size * 0.02) + (i === 0 ? size * 0.01 : 0)} // calculated border radius for corner squares
            width={cellSize * (7 - i * 2)}
            x={x1 + cellSize * i}
            y={y1 + cellSize * i}
            key={`Rect-${index}-${i}`}
          />
        );
      }
    });

    const clearArenaSize = Math.floor(logoSize / cellSize);

    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2;

    matrix.forEach((row: any, i: number) => {
      row.forEach((column: any, j: number) => {
        if (matrix[i][j]) {
          if (
            !(
              (i < 7 && j < 7) ||
              (i > matrix.length - 8 && j < 7) ||
              (i < 7 && j > matrix.length - 8)
            )
          ) {
            if (
              !(
                i > matrixMiddleStart &&
                i < matrixMiddleEnd &&
                j > matrixMiddleStart &&
                j < matrixMiddleEnd
              )
            ) {
              result.push(
                <Circle
                  cx={i * cellSize + cellSize / 2}
                  cy={j * cellSize + cellSize / 2}
                  fill={fillColor}
                  r={cellSize / 3} // calculate size of single result
                  key={`Circle-${i}-${j}`}
                />
              );
            }
          }
        }
      });
    });

    return result;
  }, [ecl, fillColor, getFill, logoSize, size, value]);

  const logoPosition = size / 2 - logoSize / 2 - logoMargin;
  const logoWrapperSize = logoSize + logoMargin * 2;

  return (
    <Svg height={size} width={size}>
      <Defs>
        <ClipPath id="clip-wrapper">
          <Rect height={logoWrapperSize} width={logoWrapperSize} />
        </ClipPath>
        <ClipPath id="clip-logo">
          <Rect height={logoSize} width={logoSize} />
        </ClipPath>
      </Defs>
      {backgroundColor && (
        <Rect fill={backgroundColor} height={size} width={size} />
      )}
      {dots as any}
      <G x={logoPosition + 3} y={logoPosition + 3}>
        <Rect
          clipPath="url(#clip-wrapper)"
          fill={logoBackgroundColor}
          height={logoWrapperSize}
          width={logoWrapperSize}
        />
        <G x={logoMargin} y={logoMargin}>
          {logo ? (
            <Image
              clipPath="url(#clip-logo)"
              height={logoSize - 4}
              href={logo}
              preserveAspectRatio="xMidYMid slice"
              width={logoSize - 4}
            />
          ) : (
            <Svg
              width={logoSize - 4}
              height={logoSize - 4}
              viewBox="0 0 20 20"
              fill={fillColor}
            >
              <Path d="M19.7489 10.5751C20.1866 10.3875 20.1866 9.76693 19.7489 9.57933L16.8123 8.32081C14.575 7.362 12.7924 5.57931 11.8336 3.34207L10.575 0.405505C10.3874 -0.0322229 9.76687 -0.0322221 9.57926 0.405505L8.32075 3.34207C7.36194 5.57931 5.57924 7.362 3.34201 8.32081L0.405444 9.57933C-0.0322834 9.76693 -0.0322836 10.3875 0.405444 10.5751L3.34201 11.8336C5.57924 12.7924 7.36194 14.5751 8.32075 16.8124L9.57926 19.7489C9.76687 20.1866 10.3874 20.1866 10.575 19.7489L11.8336 16.8124C12.7924 14.5751 14.575 12.7924 16.8123 11.8336L19.7489 10.5751Z" />
            </Svg>
          )}
        </G>
      </G>
    </Svg>
  );
};
