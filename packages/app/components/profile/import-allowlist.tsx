import { useCallback } from "react";
import { Platform, Linking } from "react-native";

import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import { Button } from "@showtime-xyz/universal.button";
import { useRouter } from "@showtime-xyz/universal.router";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { getAccessToken } from "app/lib/access-token";
import { Logger } from "app/lib/logger";
import {
  extractMimeType,
  generateRandomFilename,
  getFileFormData,
} from "app/utilities";

import { toast } from "design-system/toast";

export const ImportAllowlist = () => {
  const router = useRouter();
  const pickCSV = useCallback(async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: ["text/csv"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (file.canceled === false) {
        const uploadUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channels/allowlist/upload`;
        const accessToken = getAccessToken();
        const headers = {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/form-data`,
        };
        const attachment = file.assets[0].uri;
        if (Platform.OS === "web") {
          const attachmentFormData = await getFileFormData(attachment);
          const formData = new FormData();
          formData.append(
            "file",
            attachmentFormData!,
            generateRandomFilename(extractMimeType(attachment))
          );
          await axios({
            url: uploadUrl,
            method: "POST",
            headers: headers,
            data: formData,
          });
        } else {
          await FileSystem.uploadAsync(uploadUrl, attachment, {
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
            fieldName: "file",
            httpMethod: "POST",
            headers,
          });
        }
        toast.success("Allowlist imported successfully");

        const nativeUrl = "/creator-token/import-allowlist-success";
        const url = Platform.select({
          native: nativeUrl,
          web: {
            pathname: router.pathname,
            query: {
              ...router.query,
              creatorTokensImportedAllowlistSuccessModal: true,
            },
          } as any,
        });
        const as = Platform.select({ native: nativeUrl, web: router.asPath });
        if (Platform.OS === "web") {
          router.replace(url, as);
          return;
        }
        router.pop();
        router.push(url, as);
      }
    } catch (error) {
      toast.error("Failed to upload csv file");
      Logger.error(error);
    }
  }, [router]);

  const downloadCSVTemplate = useCallback(async () => {
    const url =
      "https://media.showtime.xyz/assets/ExampleOfWalletAddressList.csv";
    Linking.openURL(url);
    toast.success("Downloaded successfully!");
  }, []);

  return (
    <View tw="px-4 py-4">
      <Text tw="text-xl font-bold text-gray-900 dark:text-white">
        Give your previous collectors free access to your channel.
      </Text>
      <View tw="h-3" />
      <Text tw="text-sm text-gray-800 dark:text-gray-200">
        By importing an allowlist (Ethereum wallet addresses spreadsheet, ENS
        supported), your existing community will not need to buy 1 of your
        Creator Tokens to unlock your channel.
      </Text>
      <Button size="regular" tw="my-4 w-full" onPress={pickCSV}>
        Import Allowlist (.csv)
      </Button>
      <Button
        size="regular"
        variant="outlined"
        tw="w-full"
        onPress={downloadCSVTemplate}
      >
        Download template
      </Button>
    </View>
  );
};
