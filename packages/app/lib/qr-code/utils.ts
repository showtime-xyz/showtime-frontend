import QRCode from "qrcode";
import type { QRCodeErrorCorrectionLevel } from "qrcode";

export const genMatrix = (
  value: string,
  errorCorrectionLevel: QRCodeErrorCorrectionLevel
) => {
  const arr = Array.prototype.slice.call(
    QRCode.create(value, { errorCorrectionLevel }).modules.data,
    0
  );
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  );
};

export const transformMatrixIntoPath = (matrix: any, size: number) => {
  const cellSize = size / matrix.length;
  let path = "";
  matrix.forEach((row: any, i: number) => {
    let needDraw = false;
    row.forEach((column: any, j: number) => {
      if (column) {
        if (!needDraw) {
          path += `M${cellSize * j} ${cellSize / 2 + cellSize * i} `;
          needDraw = true;
        }
        if (needDraw && j === matrix.length - 1) {
          path += `L${cellSize * (j + 1)} ${cellSize / 2 + cellSize * i} `;
        }
      } else {
        if (needDraw) {
          path += `L${cellSize * j} ${cellSize / 2 + cellSize * i} `;
          needDraw = false;
        }
      }
    });
  });
  return {
    cellSize,
    path,
  };
};
