import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

import { GatingType } from "app/types";

import { colors } from "design-system/tailwind/colors";

export const config = {
  runtime: "edge",
};
const baseURL = __DEV__
  ? "http://localhost:3000"
  : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`;

const fontSemiBold = fetch(`${baseURL}/assets/Inter-SemiBold.otf`).then((res) =>
  res.arrayBuffer()
);
const fontBold = fetch(`${baseURL}/assets/Inter-Bold.otf`).then((res) =>
  res.arrayBuffer()
);
const fontRegular = fetch(`${baseURL}/assets/Inter-Regular.otf`).then((res) =>
  res.arrayBuffer()
);
const getGatingTypeLinearGradient = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return "linear-gradient(158deg, #F4CE5E 23.96%, #F4CE5E 54.12%, #F1A819 69.63%, #FFD480 82.36%, #FBC73F 91.83%, #F5E794 99.79%)";
  }
  return "linear-gradient(154deg, #00E786 0%, #4B27FE 36.26%, #B013D8 100%)";
};
const getGatingTypeTextColor = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return colors.gray[900];
  }
  return "#FFF";
};
const getGatingTypeLabel = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return "Collect to unlock channel";
  }
  if (
    gatingType === "multi_provider_music_presave" ||
    gatingType === "music_presave" ||
    gatingType === "spotify_presave"
  ) {
    return "Presave to collect";
  }
  if (
    gatingType === "spotify_save" ||
    gatingType === "multi_provider_music_save"
  ) {
    return "Save to collect";
  }
  return null;
};
const getGatingTypeIcon = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return (
      <svg
        width="11"
        height="15"
        viewBox="0 0 11 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.645036"
          y="6.98573"
          width="9.14135"
          height="6.41097"
          rx="0.957251"
          fill="#FFD554"
          stroke="#FFD554"
          strokeWidth="1.27634"
        />
        <path
          d="M8.40292 6.57029V4.6385C8.41719 3.56629 7.80375 1.42188 5.23589 1.42188C2.95901 1.42188 2.19662 3.10782 2.05322 4.23737"
          stroke="#FFD554"
          strokeWidth="1.9145"
        />
      </svg>
    );
  }
  if (
    gatingType === "multi_provider_music_presave" ||
    gatingType === "music_presave" ||
    gatingType === "spotify_presave" ||
    gatingType === "spotify_save" ||
    gatingType === "multi_provider_music_save"
  ) {
    return (
      <svg
        width="16"
        height="21"
        viewBox="0 0 16 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.71437 1.87539L14.6306 0.0236241C15.3389 -0.123485 16.0004 0.435112 16 1.18002L15.992 15.4868C15.9911 17.0355 14.941 18.3733 13.4719 18.6971L13.0538 18.7892C11.5713 19.1159 10.1739 17.9507 10.1739 16.3879C10.1739 15.2511 10.9369 14.2656 12.0121 14.0135L13.8221 13.5892C14.4112 13.4512 14.8293 12.9112 14.8293 12.2884V5.80456C14.8293 5.35305 14.4276 5.01504 13.9985 5.10543L6.57303 6.66973C6.13873 6.76119 5.82688 7.15503 5.82688 7.61199V17.6021C5.82688 19.1484 4.79713 20.4925 3.33802 20.8506L3.0136 20.9303C1.47606 21.3076 0 20.1057 0 18.4763C0 17.3592 0.753937 16.3925 1.81226 16.1527L3.65964 15.7342C4.25311 15.5997 4.67589 15.0577 4.67589 14.4312V3.18318C4.67589 2.54796 5.11034 2.00084 5.71437 1.87539Z"
          fill="white"
        />
      </svg>
    );
  }

  return null;
};
const getGatingTypeColor = (gatingType: GatingType) => {
  if (gatingType === "paid_nft") {
    return "#FFD554";
  }

  return "#FFF";
};
export default async function handler(req: NextRequest) {
  const { search } = req.nextUrl;

  const paramsString = decodeURIComponent(search).replace(/&amp;/g, "&");
  const searchParams = new URLSearchParams(paramsString);
  const username = searchParams.get("username");
  const image = searchParams.get("image");
  const pfp = searchParams.get("pfp");
  const desc = searchParams.get("desc");
  const gatingType = searchParams.get("gatingType") as GatingType;

  const fontBoldData = await fontBold;
  const fontSemiBoldData = await fontSemiBold;
  const fontRegularData = await fontRegular;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          color: getGatingTypeTextColor(gatingType),
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
            backgroundImage: getGatingTypeLinearGradient(gatingType),
          }}
        >
          <div
            style={{
              display: "flex",
              marginLeft: 40,
              width: 320,
              height: 320,
              position: "relative",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            <img
              src={image}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
              }}
            />
            {getGatingTypeLabel(gatingType) ? (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "50px",
                  background: "#000",
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {getGatingTypeIcon(gatingType)}
                <p
                  style={{
                    color: getGatingTypeColor(gatingType),
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "50px",
                    marginLeft: 8,
                  }}
                >
                  {getGatingTypeLabel(gatingType)}
                </p>
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              marginLeft: "20px",
              paddingRight: "16px",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              paddingTop: "32px",
              paddingBottom: "44px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <img
                src={pfp}
                style={{
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  borderRadius: "999px",
                  marginRight: 8,
                }}
              />
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                @{username}
              </p>
            </div>
            <div
              style={{
                fontWeight: 400,
                fontSize: "22px",
                width: "auto",
                wordBreak: "break-word",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                marginTop: "8px",
                // @ts-ignore
                "-webkit-line-clamp": 8,
                "-webkit-box-orient": "vertical",
              }}
            >
              {desc}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                lineHeight: "29px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  display: "flex",
                  marginRight: "8px",
                  lineHeight: "29px",
                  marginTop: "2px",
                }}
              >
                Collect on
              </div>
              <svg
                width="190"
                height="29"
                viewBox="0 0 190 29"
                xmlns="http://www.w3.org/2000/svg"
                fill={getGatingTypeTextColor(gatingType)}
              >
                <path d="M61.4217 0.906986C61.4217 0.804661 61.3396 0.720947 61.2372 0.720947H57.1504C57.0481 0.720947 56.9644 0.804661 56.9644 0.906986V25.7953C56.9644 25.8977 57.0481 25.9798 57.1504 25.9798H61.2372C61.3396 25.9798 61.4217 25.8977 61.4217 25.7953V11.6791C61.4217 11.5767 61.5054 11.493 61.6078 11.493H65.1364C67.1892 11.493 68.8512 13.1566 68.8512 15.2078V25.7953C68.8512 25.8977 68.9349 25.9798 69.0372 25.9798H73.1241C73.2264 25.9798 73.3085 25.8977 73.3085 25.7953V15.2078C73.3085 10.6946 69.6496 7.03567 65.1364 7.03567H61.6078C61.5054 7.03567 61.4217 6.95351 61.4217 6.84963V0.906986Z" />
                <path d="M137.202 7.59375C137.202 7.48988 137.285 7.40771 137.388 7.40771H141.473C141.575 7.40771 141.659 7.48988 141.659 7.59375V25.7953C141.659 25.8976 141.575 25.9798 141.473 25.9798H137.388C137.285 25.9798 137.202 25.8976 137.202 25.7953V7.59375Z" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M94.1117 16.6946C94.1117 22.0279 89.7877 26.3519 84.4528 26.3519C79.1194 26.3519 74.7954 22.0279 74.7954 16.6946C74.7954 11.3597 79.1194 7.03564 84.4528 7.03564C89.7877 7.03564 94.1117 11.3597 94.1117 16.6946ZM89.6543 16.6946C89.6543 19.5659 87.3256 21.8946 84.4528 21.8946C81.5815 21.8946 79.2528 19.5659 79.2528 16.6946C79.2528 13.8217 81.5815 11.493 84.4528 11.493C87.3256 11.493 89.6543 13.8217 89.6543 16.6946Z"
                />
                <path d="M125.871 7.40777C125.974 7.40777 126.058 7.32404 126.058 7.22171V0.906986C126.058 0.804661 126.14 0.720947 126.244 0.720947H130.329C130.431 0.720947 130.515 0.804661 130.515 0.906986V7.22171C130.515 7.32404 130.599 7.40777 130.701 7.40777H134.786C134.889 7.40777 134.972 7.48994 134.972 7.59381V11.6791C134.972 11.7814 134.889 11.8651 134.786 11.8651H130.701C130.599 11.8651 130.515 11.9473 130.515 12.0512V19.2946C130.515 20.5256 131.513 21.5225 132.744 21.5225H134.786C134.889 21.5225 134.972 21.6062 134.972 21.7085V25.7953C134.972 25.8977 134.889 25.9798 134.786 25.9798H132.744C129.051 25.9798 126.058 22.9876 126.058 19.2946V12.0512C126.058 11.9473 125.974 11.8651 125.871 11.8651H123.271C123.169 11.8651 123.085 11.7814 123.085 11.6791V7.59381C123.085 7.48994 123.169 7.40777 123.271 7.40777H125.871Z" />
                <path d="M44.8929 7.40771C41.7115 7.40771 39.1348 9.98445 39.1348 13.1643C39.1348 16.3441 41.7115 18.9224 44.8929 18.9224H49.7208C50.4386 18.9224 51.0216 19.5054 51.0216 20.2232C51.0216 20.941 50.4386 21.5224 49.7208 21.5224H39.3208C39.2169 21.5224 39.1348 21.6062 39.1348 21.7085V25.7953C39.1348 25.8976 39.2169 25.9798 39.3208 25.9798H49.7208C52.9007 25.9798 55.4789 23.403 55.4789 20.2232C55.4789 17.0434 52.9007 14.4651 49.7208 14.4651H44.8929C44.1735 14.4651 43.5921 13.8837 43.5921 13.1643C43.5921 12.4465 44.1735 11.8651 44.8929 11.8651H54.1782C54.2805 11.8651 54.3642 11.7813 54.3642 11.679V7.59375C54.3642 7.48988 54.2805 7.40771 54.1782 7.40771H44.8929Z" />
                <path d="M95.0744 7.40771C94.9581 7.40771 94.8698 7.51313 94.8915 7.62631L98.2558 25.8279C98.2728 25.9162 98.3488 25.9798 98.4388 25.9798H105.784C105.874 25.9798 105.95 25.9162 105.967 25.8279L108.243 13.5131C108.281 13.31 108.572 13.31 108.609 13.5131L110.887 25.8279C110.902 25.9162 110.98 25.9798 111.068 25.9798H118.414C118.504 25.9798 118.58 25.9162 118.597 25.8279L121.961 7.62631C121.983 7.51313 121.896 7.40771 121.78 7.40771H117.623C117.535 7.40771 117.457 7.47127 117.442 7.55964L114.881 21.4062C114.868 21.4744 114.809 21.5224 114.741 21.5224C114.673 21.5224 114.614 21.4744 114.602 21.4062L112.042 7.55964C112.025 7.47127 111.949 7.40771 111.859 7.40771H104.994C104.904 7.40771 104.828 7.47127 104.811 7.55964L102.251 21.4062C102.239 21.4744 102.18 21.5224 102.112 21.5224C102.043 21.5224 101.984 21.4744 101.972 21.4062L99.4124 7.55964C99.3953 7.47127 99.3193 7.40771 99.2294 7.40771H95.0744Z" />
                <path d="M158.56 25.9798C158.663 25.9798 158.746 25.8976 158.746 25.7953V12.0511C158.746 11.9472 158.829 11.8651 158.932 11.8651H161.718C163.358 11.8651 164.69 13.1953 164.69 14.8372V25.7953C164.69 25.8976 164.772 25.9798 164.874 25.9798H168.961C169.063 25.9798 169.147 25.8976 169.147 25.7953V14.8372C169.147 10.7333 165.82 7.40771 161.718 7.40771H144.073C143.97 7.40771 143.887 7.48988 143.887 7.59375V25.7953C143.887 25.8976 143.97 25.9798 144.073 25.9798H148.16C148.262 25.9798 148.346 25.8976 148.346 25.7953V12.0511C148.346 11.9472 148.428 11.8651 148.53 11.8651H151.316C152.956 11.8651 154.287 13.1938 154.288 14.8341V25.7953C154.288 25.8976 154.372 25.9798 154.474 25.9798H158.56Z" />
                <path d="M137.202 2.02173C137.202 1.91786 137.284 1.83569 137.386 1.83569H141.473C141.575 1.83569 141.659 1.91786 141.659 2.02173V5.73648C141.659 5.8388 141.575 5.92098 141.473 5.92098H137.386C137.284 5.92098 137.202 5.8388 137.202 5.73648V2.02173Z" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M180.292 21.8946C178.023 21.8946 176.093 20.4419 175.383 18.417C175.341 18.2992 175.431 18.1798 175.555 18.1798H189.763C189.865 18.1798 189.949 18.0961 189.949 17.9938V16.6946C189.949 11.3597 185.625 7.03564 180.292 7.03564C174.957 7.03564 170.633 11.3597 170.633 16.6946C170.633 22.0279 174.957 26.3519 180.292 26.3519C182.926 26.3519 185.482 25.2946 187.386 23.6217C188.07 23.0217 188.687 22.3256 189.197 21.5488C189.262 21.4527 189.219 21.3209 189.11 21.2791L185.148 19.738C185.075 19.7101 184.991 19.7302 184.938 19.7876C184.786 19.955 184.622 20.1178 184.445 20.2728C183.289 21.2883 181.76 21.8946 180.292 21.8946ZM180.292 11.493C182.56 11.493 184.489 12.9457 185.199 14.9705C185.241 15.0884 185.152 15.2077 185.027 15.2077H175.555C175.431 15.2077 175.341 15.0884 175.383 14.9705C176.093 12.9457 178.023 11.493 180.292 11.493Z"
                />
                <path d="M25.8232 16.4248C26.3782 16.186 26.3782 15.3984 25.8232 15.1612L22.0961 13.5643C19.2589 12.3472 16.9968 10.0868 15.7798 7.248L14.1829 3.52242C13.9457 2.96583 13.1581 2.96583 12.9193 3.52242L11.3224 7.248C10.1069 10.0868 7.8449 12.3472 5.00614 13.5643L1.28054 15.1612C0.725498 15.3984 0.725498 16.186 1.28054 16.4248L5.00614 18.0217C7.8449 19.2372 10.1069 21.4992 11.3224 24.3379L12.9193 28.0635C13.1581 28.6186 13.9457 28.6186 14.1829 28.0635L15.7798 24.3379C16.9968 21.4992 19.2589 19.2372 22.0961 18.0217L25.8232 16.4248Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
      fonts: [
        {
          name: "Inter",
          data: fontRegularData,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontSemiBoldData,
          weight: 600,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontBoldData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
