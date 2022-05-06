export enum Placement {
  top,
  bottom,
}
export type PlatformRect = Pick<
  DOMRect,
  "top" | "left" | "width" | "height"
> | null;
interface IPosition {
  left: number;
  top: number;
}
export const getPosition = (
  triggerRect: PlatformRect,
  contentRect: PlatformRect,
  placement: Placement
) => {
  "worklet";
  let position: IPosition = {
    top: 0,
    left: 0,
  };
  if (triggerRect && contentRect) {
    const dWidth = triggerRect.width - contentRect.width;
    switch (placement) {
      case Placement.top:
        position.left += triggerRect.left + dWidth / 2;
        position.top +=
          triggerRect.top - Math.max(triggerRect.height, contentRect.height);
        break;

      case Placement.bottom:
        position.left += triggerRect.left + dWidth / 2;
        position.top += triggerRect.top + triggerRect.height;
        break;
    }
  }
  return position;
};
