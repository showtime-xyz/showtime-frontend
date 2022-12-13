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
  logoSize = size * 0.3,
  logoBackgroundColor = "transparent",
  logoMargin = 2,
  ecl = "L",
}: QRCodeProps) => {
  const isDark = useIsDarkMode();

  const fillColors = useMemo(
    () => (isDark ? ["black", "white"] : ["white", "black"]),
    [isDark]
  );
  const fillColor = isDark ? fillColors[1] : fillColors[1];

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

    qrPositonList.forEach(({ x, y }) => {
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
      <G x={logoPosition + 6} y={logoPosition + 6}>
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
              height={logoSize - 10}
              href={logo}
              preserveAspectRatio="xMidYMid slice"
              width={logoSize - 10}
            />
          ) : (
            <Svg
              width={logoSize - 10}
              height={logoSize - 10}
              viewBox="0 0 80 80"
            >
              <Path
                d="M75.71 41.838c1.617-.692 1.617-2.984 0-3.676l-10.842-4.647a35 35 0 0 1-18.383-18.383L41.838 4.289c-.692-1.616-2.984-1.616-3.676 0l-4.647 10.843a35 35 0 0 1-18.383 18.383L4.289 38.162c-1.616.692-1.616 2.984 0 3.676l10.843 4.647a35 35 0 0 1 18.383 18.383l4.647 10.843c.692 1.616 2.984 1.616 3.676 0l4.647-10.843a35 35 0 0 1 18.383-18.383l10.843-4.647Z"
                fill={fillColor}
              />
            </Svg>
          )}
        </G>
      </G>
    </Svg>
  );
};
