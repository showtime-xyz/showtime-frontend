import { useEffect, useState } from "react";

import ImageColors from "react-native-image-colors";
import tinycolor from "tinycolor2";

type GetImageColorsParams = {
  uri: string;
};
const FALLBACK_COLOR = "#4C4B4E";

export const useGetImageColors = ({ uri }: GetImageColorsParams) => {
  const [colors, setColors] = useState<{
    colors: string[];
    textColor: string;
    isDark: boolean;
  }>();

  useEffect(() => {
    (async () => {
      if (__DEV__) {
        setColors({
          colors: ["#333", "#FFF"],
          textColor: "#FFF",
          isDark: true,
        });
        return;
      }
      const result = await ImageColors.getColors(uri, {
        fallback: FALLBACK_COLOR,
        cache: true,
        key: uri,
      });
      let primaryColor = FALLBACK_COLOR;
      switch (result.platform) {
        case "android":
          if (result.vibrant) {
            primaryColor = result.vibrant;
          }
          break;
        case "web":
          if (result.vibrant) {
            primaryColor = result.vibrant;
          }
          break;
        case "ios":
          if (result.primary) {
            primaryColor = result.primary;
          }
          break;
        default:
          throw new Error("Unexpected platform key");
      }
      const primaryStartColor = tinycolor(primaryColor)
        .setAlpha(0.8)
        .toString();
      const primaryEndColor = tinycolor(primaryColor).setAlpha(0.6).toString();
      const isDark = tinycolor(primaryColor).isDark();
      setColors({
        colors: [primaryStartColor, primaryEndColor],
        textColor: "#FFF",
        isDark,
      });
    })();
  }, [uri]);
  return {
    imageColors: colors,
  };
};
