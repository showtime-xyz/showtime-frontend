import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException, captureMessage } from "app/lib/sentry";
import { getFileFormData } from "app/utilities";

export const useUploadMediaToPinata = () => {
  const uploadMedia = async ({ file }: { file: File | string }) => {
    try {
      const formData = new FormData();
      const fileFormData = await getFileFormData(file);

      if (!fileFormData) {
        throw "Failed to generate the file form data";
      }

      formData.append("file", fileFormData);

      const res = await axios({
        url: `/v1/media/upload`,
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data`,
        },
        data: formData,
      });

      return res.ipfs_hash;
    } catch (error) {
      captureMessage("ipfs upload failed");
      captureException(error);
      Logger.error(error);
      return null;
    }
  };

  return uploadMedia;
};
