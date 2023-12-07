export type VideoProps = {
  height: number;
  width: number;
  uri: string | File;
  resizeMode: "contain" | "cover";
  muted: boolean;
  loop: boolean;
  autoPlay?: boolean;
};
