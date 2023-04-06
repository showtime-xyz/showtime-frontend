import Dropzone from "react-dropzone";

import { DropFileZoneProps } from ".";

export const DropFileZone = ({
  children,
  onChange,
  disabled,
}: DropFileZoneProps) => {
  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        const file = acceptedFiles[0];
        const fileType = file["type"].split("/")[0] as "image" | "video";
        onChange({ file, size: file.size, type: fileType });
      }}
      disabled={disabled}
    >
      {({ getRootProps }) => <div {...getRootProps()}>{children}</div>}
    </Dropzone>
  );
};
