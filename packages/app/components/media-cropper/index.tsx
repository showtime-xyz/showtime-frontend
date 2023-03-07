import React from "react";

export type MediaCropperProps = {
  src: string | null;
  visible: boolean;
  onClose: () => void;
  onApply?: (src: Blob) => void;
  aspect?: number;
  title?: string;
  cropViewHeight?: number;
};
export const MediaCropper: React.FC<MediaCropperProps> = () => {
  return null;
};
