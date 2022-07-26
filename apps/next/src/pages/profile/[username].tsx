import axios from "axios";

import { UserType } from "app/types";
import { formatAddressShort } from "app/utilities";

export { default } from "app/pages/profile";

export async function getServerSideProps(context) {
  const username = context.params.username;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v4/profile_server/${username}`
    );

    const user = res.data as UserType;
    let title;

    if (user.data.profile.username && user.data.profile.name) {
      title = `${user.data.profile.name} (@${user.data.profile.username})`;
    } else if (user.data.profile.name) {
      title = user.data.profile.name;
    } else if (user.data.profile.username) {
      title = user.data.profile.username;
    } else {
      title = formatAddressShort(
        user.data.profile.wallet_addresses_v2?.[0]?.address
      );
    }

    title += " " + "| Showtime";

    if (user) {
      return {
        props: {
          meta: {
            title,
            description: user.data.profile.bio,
            image: user.data.profile.img_url,
          },
        },
      };
    }
  } catch (e) {}

  return {
    props: {},
  };
}
