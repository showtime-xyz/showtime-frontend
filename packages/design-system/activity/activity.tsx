import { formatDistanceToNowStrict } from "date-fns";

import Router from "next/router";
import { ACTIVITY_TYPES, DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { View } from "design-system/view";
import { Text } from "design-system/text";
import { Avatar } from "design-system/activity/avatar";
import {
  Like,
  Comment,
  Sell,
  Buy,
  Create,
  Follow,
  Transfer,
} from "design-system/activity/types";
import { TextLink } from "app/navigation/link";
import { Pressable } from "react-native";
import { useRouter } from "app/navigation/use-router";

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
  const router = useRouter();
  const openProfile = (walletAddress: string) => {
    const as = `/profile/${walletAddress}`;

    const href = Router.router
      ? {
          pathname: Router.pathname,
          query: { ...Router.query, walletAddress },
        }
      : as;

    router.push(href, as, { shallow: true });
  };

  return (
    <View tw="p-4">
      <View tw="h-12 flex-row">
        <Pressable onPress={() => openProfile(actor.wallet_address)}>
          <Avatar
            url={getProfileImageUrl(actor.img_url ?? DEFAULT_PROFILE_PIC)}
            icon={type}
          />
        </Pressable>

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
              href={"/profile/" + actor.wallet_address}
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
