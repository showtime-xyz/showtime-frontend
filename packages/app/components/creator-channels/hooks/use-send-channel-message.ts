import { useContext } from "react";
import { Platform } from "react-native";

import * as FileSystem from "expo-file-system";
import { Audio, Image } from "react-native-compressor";
import useSWRMutation from "swr/mutation";

import { UserContext } from "app/context/user-context";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { getAccessToken } from "app/lib/access-token";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";
import {
  extractMimeType,
  generateRandomFilename,
  getFileFormData,
} from "app/utilities";

import { BaseAttachment, ImageAttachment } from "../types";
import { useChannelMessages } from "./use-channel-messages";
import { useOwnedChannelsList } from "./use-channels-list";

async function postMessage(
  url: string,
  {
    arg,
  }: {
    arg: {
      channelId: string;
      message: string;
      attachment: string;
      mimeType: string;
    };
  }
) {
  return axios({
    url,
    method: "POST",
    data: {
      body: arg.message,
    },
  });
}

async function uploadMediaNative(
  url: string,
  {
    arg,
  }: {
    arg: {
      channelId: string;
      message: string;
      attachment: string;
      mimeType: string;
    };
  }
) {
  const accessToken = getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  let result = arg.attachment;

  // TODO: video compression

  if (arg?.mimeType?.includes("audio")) {
    result = await Audio.compress(arg.attachment, {
      quality: "medium",
    });
  }

  if (arg?.mimeType?.includes("image")) {
    result = await Image.compress(arg.attachment, {
      quality: 0.8,
      maxWidth: 1200,
    });
  }

  return FileSystem.uploadAsync(url, result, {
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
    fieldName: "file",
    httpMethod: "POST",
    headers,
  });
}

async function uploadMediaWeb(
  url: string,
  { arg }: { arg: { channelId: string; message: string; attachment: string } }
) {
  const attachmentFormData = await getFileFormData(arg.attachment);
  const formData = new FormData();
  if (attachmentFormData) {
    formData.append(
      "file",
      attachmentFormData,
      generateRandomFilename(extractMimeType(arg.attachment))
    );

    return axios({
      url,
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data`,
      },
      data: formData,
    });
  }
}

export const useSendChannelMessage = (
  channelId?: string,
  hasAttachment?: boolean
) => {
  const { trigger, isMutating, error } = useSWRMutation(
    hasAttachment
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channels/${channelId}/attachment/upload`
      : `/v1/channels/${channelId}/messages/send`,
    hasAttachment
      ? Platform.OS === "web"
        ? uploadMediaWeb
        : uploadMediaNative
      : postMessage
  );
  const channelMessages = useChannelMessages(channelId);
  const joinedChannelsList = useOwnedChannelsList();

  const user = useContext(UserContext);
  const handleSubmit = useStableCallback(
    async ({
      message,
      mimeType,
      attachment,
      channelId,
      isUserAdmin,
      callback,
      width,
      height,
    }: {
      channelId: string;
      attachment?: string;
      message: string;
      mimeType?: string;
      isUserAdmin?: boolean;
      callback?: () => void;
      width?: number;
      height?: number;
    }) => {
      const optimisticObjectId = Math.random() + new Date().getTime();
      channelMessages.mutate(
        (d) => {
          if (user?.user && d) {
            const optimisticObject = {
              channel_message: {
                body: message,
                body_text_length: message.length,
                id: optimisticObjectId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                sent_by: {
                  admin: isUserAdmin || false,
                  created_at: new Date().toISOString(),
                  id: user.user.data.profile.profile_id,
                  profile: user.user?.data.profile,
                },
                attachments: attachment
                  ? [
                      {
                        url: attachment,
                        description: "",
                        mime: mimeType,
                        width,
                        height,
                        duration: 0,
                      } as ImageAttachment | BaseAttachment,
                    ]
                  : [],
              },
              reaction_group: [],
            };

            if (d.length === 0) {
              return [[optimisticObject]];
            } else {
              d[0] = [optimisticObject, ...d[0]];
              return [...d];
            }
          }
          return d;
        },
        {
          revalidate: false,
        }
      );

      try {
        const res = await trigger(
          {
            message: message || "",
            channelId,
            attachment: attachment || "",
            mimeType: mimeType || "",
          },
          {
            revalidate: false,
          }
        );

        channelMessages.mutate(
          (d) => {
            if (d) {
              d[0] = d[0].map((v) => {
                if (v.channel_message.id === optimisticObjectId) {
                  return {
                    channel_message: hasAttachment
                      ? Platform.OS === "web"
                        ? res
                        : JSON.parse(res.body)
                      : res,
                    reaction_group: [],
                  };
                }
                return v;
              });

              return [...d];
            }
            return d;
          },
          {
            revalidate: true,
          }
        );
      } catch (e) {
        captureException(e);
        Logger.error(e);
      } finally {
        joinedChannelsList.refresh();
      }

      callback?.();
    }
  );

  return {
    trigger: handleSubmit,
    isMutating,
    error,
  };
};
