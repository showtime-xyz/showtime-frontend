import { formatDistanceToNowStrict } from "date-fns";

import { ACTIVITY_TYPES, DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { View } from "@showtime/universal-ui.view";
import { Text } from "@showtime/universal-ui.text";
import { Avatar } from "@showtime/universal-ui.activity/avatar";
import {
  Like,
  Comment,
  Sell,
  Buy,
  Create,
  Follow,
  Transfer,
} from "@showtime/universal-ui.activity/types";
import { TextLink } from "app/navigation/link";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

type Props = {
  activity: any;
};

function Activity({ activity }: Props) {
  const { type, actor } = activity;

  return (
    <View tw="p-4">
      <View tw="h-12 flex-row">
        <Avatar
          url={getProfileImageUrl(actor.img_url ?? DEFAULT_PROFILE_PIC)}
          icon={type}
        />

        <View tw="justify-center ml-2">
          <Text
            variant="text-sm"
            tw="text-gray-600 dark:text-gray-400 max-w-[69vw]"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            <TextLink
              variant="text-sm"
              tw="text-black dark:text-white font-bold"
              href=""
            >
              @{actor.username}{" "}
            </TextLink>

            {type === ACTIVITY_TYPES.LIKE && <Like act={activity} />}

            {type === ACTIVITY_TYPES.COMMENT && <Comment act={activity} />}

            {type === ACTIVITY_TYPES.SELL && <Sell act={activity} />}

            {type === ACTIVITY_TYPES.BUY && <Buy act={activity} />}

            {type === ACTIVITY_TYPES.CREATE && <Create act={activity} />}

            {type === ACTIVITY_TYPES.FOLLOW && <Follow act={activity} />}

            {type === ACTIVITY_TYPES.SEND && <></>}

            {type === ACTIVITY_TYPES.RECEIVE && <Transfer act={activity} />}
          </Text>

          <View tw="h-2" />

          <Text variant="text-xs" tw="text-gray-600 dark:text-gray-400">
            {formatDistanceToNowStrict(new Date(`${activity.timestamp}Z`), {
              addSuffix: true,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

export { Activity };
