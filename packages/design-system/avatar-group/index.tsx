import { View } from "design-system/view";
import { Image } from "design-system/image";
import { DEFAULT_PROFILE_PIC } from "app/lib/constants";
import { useIsDarkMode } from "../hooks";

const getProfileImageUrl = (imgUrl: string) => {
  if (imgUrl && imgUrl.includes("https://lh3.googleusercontent.com")) {
    imgUrl = imgUrl.split("=")[0] + "=s112";
  }
  return imgUrl;
};

interface Profile {
  profile_id: number;
  img_url: string;
}

interface AvatarGroupProps {
  count: number;
  profiles?: Profile[];
}

export function AvatarGroup({ count, profiles }: AvatarGroupProps) {
  //#region hooks
  const isDarkMode = useIsDarkMode();
  //#endregion

  return (
    <View
      tw={["flex-row min-h-[28px]", `w-[${count * 28 - (count - 1) * 8}px]`]}
    >
      {profiles?.slice(0, 3).map((profile, index) => (
        <Image
          key={`avatar-${profile.profile_id}`}
          tw={[
            "w-[28px] h-[28px] rounded-full border-2 bg-gray-100 dark:bg-gray-900",
            `left-[${-(index * 8)}px]`,
            isDarkMode ? "border-black" : "border-white",
          ]}
          source={{
            uri: getProfileImageUrl(profile.img_url ?? DEFAULT_PROFILE_PIC),
          }}
        />
      ))}
    </View>
  );
}
