import React from "react";

import { Avatar } from "@showtime-xyz/universal.avatar";
import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { Description } from "app/components/card/rows";
import { Preview } from "app/components/preview";
import { useUser } from "app/hooks/use-user";
import { getCreatorUsernameFromNFT } from "app/utilities";

import { VerificationBadge } from "design-system";

type DropPreviewProps = {
  file: any;
  title: string;
  description: string;
  onEdit: () => void;
};
export const DropPreview = ({
  file,
  title,
  description,
  onEdit,
}: DropPreviewProps) => {
  const { user: userProfile } = useUser();

  return (
    <View tw="items-center">
      <View tw="shadow-light dark:shadow-dark w-full rounded-3xl py-8 md:w-[375px]">
        <Preview file={file} width={375} height={375} />
        <View tw="px-4">
          <View tw="flex-row py-4">
            <View tw="rounded-full border border-gray-200 dark:border-gray-700">
              <Avatar alt="Avatar" url={userProfile?.data.profile.img_url} />
            </View>
            <View tw="ml-2 justify-center">
              <View>
                <View tw="flex flex-row items-center">
                  <Text tw="text-13 flex font-semibold text-gray-900 dark:text-white">
                    {getCreatorUsernameFromNFT({
                      creator_address:
                        userProfile?.data.profile.primary_wallet?.address,
                      creator_name: userProfile?.data.profile.name,
                      creator_username: userProfile?.data.profile.username,
                    })}
                  </Text>

                  {userProfile?.data.profile.verified ? (
                    <VerificationBadge style={{ marginLeft: 4 }} size={12} />
                  ) : null}
                </View>
                <View tw="h-2" />
                <Text tw="text-xs font-semibold text-gray-900 dark:text-white">
                  just now
                </Text>
              </View>
            </View>
          </View>
          <Text tw="text-lg dark:text-white" numberOfLines={3}>
            {title}
          </Text>
          <Description
            descriptionText={description}
            maxLines={2}
            tw="max-h-[30vh] pt-2"
          />
          <View tw="h-4" />
          <Button variant="tertiary" size="regular" onPress={onEdit}>
            Edit
          </Button>
        </View>
      </View>
    </View>
  );
};
