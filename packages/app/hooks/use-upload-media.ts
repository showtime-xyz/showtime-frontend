import axios from "axios";
import { v4 as uuid } from "uuid";

import { Logger } from "app/lib/logger";
import { getFileFormData, getPinataToken } from "app/utilities";

export const useUploadMedia = () => {
  const uploadMedia = async (file: File | string) => {
    const formData = new FormData();
    const fileFormData = await getFileFormData(file);
    if (!fileFormData) {
      Logger.error("error in generating file form data");
      return;
    }

    formData.append("file", fileFormData);
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: uuid(),
      })
    );

    const pinataToken = await getPinataToken();
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${pinataToken}`,
          "Content-Type": `multipart/form-data`,
        },
      }
    );

    return res.data.IpfsHash;
  };

  return uploadMedia;
};
