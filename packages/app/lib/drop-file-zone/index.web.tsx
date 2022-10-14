import Dropzone from "react-dropzone";
import "react-hook-form";

import { DropFileZoneProps } from ".";

export const DropFileZone = ({ children, onChange }: DropFileZoneProps) => {
  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        const file = acceptedFiles[0];
        onChange(file);
      }}
    >
      {({ getRootProps }) => <div {...getRootProps()}>{children}</div>}
    </Dropzone>
  );
};
