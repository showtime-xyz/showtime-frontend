import { useContext } from "react";

import * as FileSystem from "expo-file-system";
import useSWRMutation from "swr/mutation";

import { UserContext } from "app/context/user-context";
import { useStableCallback } from "app/hooks/use-stable-callback";
import { getAccessToken } from "app/lib/access-token";
import { axios } from "app/lib/axios";
import { Logger } from "app/lib/logger";
import { captureException } from "app/lib/sentry";

import { BaseAttachment, ImageAttachment } from "../types";
import { useChannelMessages } from "./use-channel-messages";
import { useOwnedChannelsList } from "./use-channels-list";

async function postMessage(
  url: string,
  { arg }: { arg: { channelId: string; message: string; attachment: string } }
) {
  return axios({
    url,
    method: "POST",
    data: {
      body: arg.message,
    },
  });
}

async function uploadMedia(
  url: string,
  { arg }: { arg: { channelId: string; message: string; attachment: string } }
) {
  const accessToken = getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  return FileSystem.uploadAsync(url, arg.attachment, {
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
    fieldName: "file",
    httpMethod: "POST",
    headers,
  });
}

export const useSendChannelMessage = (
  channelId?: string,
  hasAttachment?: boolean
) => {
  const { trigger, isMutating, error } = useSWRMutation(
    hasAttachment
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channels/${channelId}/attachment/upload`
      : `/v1/channels/${channelId}/messages/send`,
    hasAttachment ? uploadMedia : postMessage
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
    }: {
      channelId: string;
      attachment?: string;
      message: string;
      mimeType?: string;
      isUserAdmin?: boolean;
      callback?: () => void;
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
                        width: 500,
                        height: 500,
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
                    channel_message: hasAttachment ? JSON.parse(res.body) : res,
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
