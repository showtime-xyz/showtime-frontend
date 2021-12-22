import { Image } from "dripsy";
import { View } from "../view";
import { tw } from "../tailwind";
import { StyleSheet } from "react-native";

type AvatarProps = {
  avatarUrl: string;
  showTokenIcon?: boolean;
};

export const Avatar = (props: AvatarProps) => {
  const { avatarUrl, showTokenIcon } = props;
  return (
    <View>
      <Image
        source={{
          uri: avatarUrl,
        }}
        style={[styles.avatar, tw.style("border-white dark:border-black")]}
      />
      {showTokenIcon ? (
        <View style={styles.wrapper}>
          <View
            style={[
              styles.semiCircle,
              tw.style("border-white dark:border-black"),
            ]}
          ></View>
          <Image
            source={require("../../../apps/expo/assets/social_token.png")}
            style={styles.socialToken}
          />
        </View>
      ) : null}
    </View>
  );
};

const AVATAR_SIZE = 144;
const SOCIAL_TOKEN_SIZE = 32;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    transform: [{ rotateZ: "-50deg" }],
    top: 100,
    left: 94,
  },
  semiCircle: {
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderTopWidth: 20,
    borderLeftWidth: 40,
  },
  avatar: {
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
    borderRadius: 999,
    borderWidth: 8,
  },
  socialToken: {
    width: SOCIAL_TOKEN_SIZE,
    height: SOCIAL_TOKEN_SIZE,
    top: 4,
    left: 4,
    position: "absolute",
    transform: [{ rotateZ: "50deg" }],
  },
});
