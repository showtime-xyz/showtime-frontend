import axios from "axios";
import { v4 as uuid } from "uuid";

import { Logger } from "app/lib/logger";
import { captureException, captureMessage } from "app/lib/sentry";
import { getFileFormData, getPinataToken } from "app/utilities";

export const useUploadMediaToPinata = () => {
  const uploadMedia = async ({
    file,
    notSafeForWork,
  }: {
    file: File | string;
    notSafeForWork: boolean;
  }) => {
    try {
      const formData = new FormData();
      const fileFormData = await getFileFormData(file);

      if (!fileFormData) {
        throw "Failed to generate the file form data";
      }

      formData.append("file", fileFormData);
      formData.append(
        "pinataMetadata",
        JSON.stringify({
          name: uuid(),
        })
      );
      if (notSafeForWork) {
        formData.append(
          "pinataContent",
          JSON.stringify({ attributes: [{ value: "NSFW" }] })
        );
      }

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
    } catch (error) {
      captureMessage("ipfs upload failed");
      captureException(error);
      Logger.error(error);
      return null;
    }
  };

  return uploadMedia;
};
