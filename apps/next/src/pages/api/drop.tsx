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
              width: 384,
              height: 384,
              position: "relative",
              borderRadius: "28px",
              overflow: "hidden",
            }}
          >
            <img
              src={image}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                objectFit: "cover",
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
                    fontSize: "22px",
                    fontWeight: 600,
                    lineHeight: "50px",
                    marginLeft: 10,
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
              marginLeft: "28px",
              paddingRight: "48px",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              paddingTop: "50px",
              paddingBottom: "56px",
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
                  width: "46px",
                  height: "46px",
                  display: "flex",
                  borderRadius: "999px",
                  marginRight: 10,
                }}
              />
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                @{username}
              </p>
            </div>
            <div
              style={{
                fontWeight: 400,
                fontSize: "25px",
                width: "auto",
                wordBreak: "break-word",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                marginTop: "10px",
                // @ts-ignore
                "-webkit-line-clamp": 9,
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
                  fontSize: "22px",
                  fontWeight: 700,
                  display: "flex",
                  marginRight: "8px",
                  lineHeight: "29px",
                  marginTop: "4px",
                }}
              >
                Collect on
              </div>
              <svg
                width="247"
                height="35"
                viewBox="0 0 247 35"
                fill={getGatingTypeTextColor(gatingType)}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M60.454 3.85629C60.454 3.75432 60.3715 3.67166 60.2697 3.67166H56.2143C56.1125 3.67166 56.0299 3.75432 56.0299 3.85629V28.5969C56.0299 28.6988 56.1125 28.7815 56.2143 28.7815H60.2697C60.3715 28.7815 60.454 28.6988 60.454 28.5969V14.5649C60.454 14.4629 60.5365 14.3802 60.6384 14.3802H64.1407C66.1771 14.3802 67.8274 16.0335 67.8274 18.0729V28.5969C67.8274 28.6988 67.9099 28.7815 68.0116 28.7815H72.067C72.1693 28.7815 72.2519 28.6988 72.2519 28.5969V18.0729C72.2519 13.5863 68.6205 9.94912 64.1407 9.94912H60.6384C60.5365 9.94912 60.454 9.86644 60.454 9.76447V3.85629Z" />
                <path d="M135.664 10.503C135.664 10.401 135.746 10.3184 135.848 10.3184H139.904C140.005 10.3184 140.088 10.401 140.088 10.503V28.5968C140.088 28.6988 140.005 28.7815 139.904 28.7815H135.848C135.746 28.7815 135.664 28.6988 135.664 28.5968V10.503Z" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M92.8973 19.55C92.8973 24.8523 88.6055 29.1508 83.3119 29.1508C78.0176 29.1508 73.7265 24.8523 73.7265 19.55C73.7265 14.2476 78.0176 9.94913 83.3119 9.94913C88.6055 9.94913 92.8973 14.2476 92.8973 19.55ZM88.4734 19.55C88.4734 22.4051 86.1627 24.7196 83.3119 24.7196C80.461 24.7196 78.1504 22.4051 78.1504 19.55C78.1504 16.6948 80.461 14.3803 83.3119 14.3803C86.1627 14.3803 88.4734 16.6948 88.4734 19.55Z"
                />
                <path d="M124.419 10.3184C124.521 10.3184 124.603 10.2357 124.603 10.1338V3.85629C124.603 3.75432 124.686 3.67166 124.788 3.67166H128.843C128.945 3.67166 129.027 3.75432 129.027 3.85629V10.1338C129.027 10.2357 129.11 10.3184 129.212 10.3184H133.267C133.369 10.3184 133.452 10.401 133.452 10.503V14.5649C133.452 14.6669 133.369 14.7495 133.267 14.7495H129.212C129.11 14.7495 129.027 14.8322 129.027 14.9342V22.1348C129.027 23.3584 130.018 24.3504 131.239 24.3504H133.267C133.369 24.3504 133.452 24.433 133.452 24.535V28.5969C133.452 28.6988 133.369 28.7815 133.267 28.7815H131.239C127.574 28.7815 124.603 25.8056 124.603 22.1348V14.9342C124.603 14.8322 124.521 14.7495 124.419 14.7495H121.838C121.737 14.7495 121.654 14.6669 121.654 14.5649V10.503C121.654 10.401 121.737 10.3184 121.838 10.3184H124.419Z" />
                <path d="M44.0481 10.3184C40.8921 10.3184 38.3337 12.8809 38.3337 16.0419C38.3337 19.203 40.8921 21.7655 44.0481 21.7655H48.8408C49.5534 21.7655 50.1312 22.3441 50.1312 23.0579C50.1312 23.7717 49.5534 24.3504 48.8408 24.3504H38.5179C38.4161 24.3504 38.3336 24.433 38.3336 24.535V28.5968C38.3336 28.6988 38.4161 28.7815 38.5179 28.7815H48.8408C51.9968 28.7815 54.5552 26.219 54.5552 23.0579C54.5552 19.8969 51.9968 17.3344 48.8408 17.3344H44.0481C43.3354 17.3344 42.7577 16.7557 42.7577 16.0419C42.7577 15.3281 43.3354 14.7495 44.0481 14.7495H53.2649C53.3667 14.7495 53.4492 14.6668 53.4492 14.5649V10.503C53.4492 10.401 53.3667 10.3184 53.2649 10.3184H44.0481Z" />
                <path d="M93.8528 10.3184C93.7373 10.3184 93.6508 10.4231 93.6712 10.5366L97.0114 28.6304C97.0279 28.718 97.1039 28.7814 97.193 28.7814H104.483C104.571 28.7814 104.648 28.718 104.664 28.6304L106.924 16.3874C106.961 16.186 107.249 16.186 107.286 16.3874L109.547 28.6305C109.563 28.718 109.638 28.7815 109.728 28.7815L117.018 28.7814C117.107 28.7814 117.183 28.718 117.199 28.6304L120.539 10.5366C120.56 10.4231 120.473 10.3184 120.358 10.3184H116.234C116.145 10.3184 116.069 10.3819 116.052 10.4694L113.512 24.2348C113.499 24.3017 113.441 24.3504 113.373 24.3504C113.305 24.3504 113.246 24.3017 113.234 24.2348L110.693 10.4694C110.677 10.3819 110.601 10.3184 110.512 10.3184H103.698C103.61 10.3184 103.533 10.3819 103.517 10.4694L100.976 24.2349C100.964 24.3017 100.906 24.3503 100.838 24.3503C100.77 24.3503 100.712 24.3017 100.699 24.2349L98.1585 10.4694C98.142 10.3819 98.066 10.3184 97.9769 10.3184H93.8528Z" />
                <path d="M156.862 28.7815C156.964 28.7815 157.047 28.6988 157.047 28.5968V14.9342C157.047 14.8322 157.129 14.7495 157.231 14.7495H159.996C161.625 14.7495 162.945 16.0721 162.945 17.7036V28.5968C162.945 28.6988 163.028 28.7815 163.13 28.7815H167.185C167.287 28.7815 167.369 28.6988 167.369 28.5968V17.7036C167.369 13.6248 164.068 10.3184 159.996 10.3184H142.484C142.382 10.3184 142.299 10.401 142.299 10.503V28.5968C142.299 28.6988 142.382 28.7815 142.484 28.7815H146.54C146.641 28.7815 146.724 28.6988 146.724 28.5968V14.9342C146.724 14.8322 146.807 14.7495 146.908 14.7495H149.673C151.302 14.7495 152.621 16.071 152.622 17.7015V28.5968C152.622 28.6988 152.705 28.7815 152.807 28.7815H156.862Z" />
                <path d="M135.663 4.96408C135.663 4.86212 135.746 4.77945 135.848 4.77945H139.904C140.005 4.77945 140.088 4.86212 140.088 4.96408V8.6567C140.088 8.75866 140.005 8.84134 139.904 8.84134H135.848C135.746 8.84134 135.663 8.75866 135.663 8.6567V4.96408Z" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M178.43 24.7196C176.179 24.7196 174.264 23.276 173.558 21.2626C173.517 21.146 173.606 21.027 173.729 21.027H187.831C187.933 21.027 188.015 20.9443 188.015 20.8424V19.55C188.015 14.2476 183.724 9.94913 178.43 9.94913C173.136 9.94913 168.844 14.2476 168.844 19.55C168.844 24.8523 173.136 29.1508 178.43 29.1508C181.044 29.1508 183.582 28.0999 185.472 26.4365C186.15 25.8401 186.763 25.1478 187.27 24.3766C187.333 24.2798 187.29 24.1499 187.182 24.1079L183.249 22.5761C183.177 22.5479 183.095 22.5684 183.043 22.626C182.891 22.7923 182.728 22.9532 182.552 23.1077C181.405 24.1173 179.887 24.7196 178.43 24.7196ZM178.43 14.3803C180.681 14.3803 182.596 15.8239 183.301 17.8373C183.342 17.9538 183.253 18.0729 183.131 18.0729H173.729C173.606 18.0729 173.517 17.9538 173.558 17.8373C174.264 15.8239 176.179 14.3803 178.43 14.3803Z"
                />
                <path
                  d="M25.1216 19.2822C25.6728 19.0455 25.6728 18.2629 25.1216 18.0263L21.4238 16.439C18.6066 15.2296 16.3618 12.9812 15.1544 10.1596L13.5696 6.45584C13.3333 5.90376 12.5519 5.90376 12.3157 6.45584L10.7309 10.1596C9.52357 12.9812 7.27875 15.2296 4.46156 16.439L0.76374 18.0263C0.212543 18.2629 0.212542 19.0455 0.76374 19.2822L4.46156 20.8694C7.27875 22.0787 9.52357 24.3271 10.7309 27.1488L12.3157 30.8526C12.5519 31.4046 13.3333 31.4046 13.5696 30.8525L15.1544 27.1488C16.3618 24.3271 18.6066 22.0787 21.4238 20.8694L25.1216 19.2822Z"
                  fill="white"
                />
                <path
                  d="M201.56 12.5472L204.469 18.0881L207.452 12.5472H211.961L207.369 20.4717L212.084 28.3962H207.596L204.469 22.9172L201.395 28.3962H196.855L201.56 20.4717L197.02 12.5472H201.56ZM217.285 34.3396C216.727 34.3396 216.205 34.2949 215.716 34.2055C215.235 34.123 214.836 34.0163 214.52 33.8856L215.51 30.6044C216.026 30.7626 216.49 30.8485 216.903 30.8624C217.323 30.8761 217.683 30.7798 217.987 30.5734C218.296 30.3671 218.547 30.0162 218.739 29.5209L218.998 28.8502L213.312 12.5472H217.935L221.216 24.1863H221.381L224.693 12.5472H229.347L223.187 30.1091C222.891 30.9621 222.488 31.705 221.98 32.3378C221.477 32.9776 220.841 33.4695 220.071 33.8134C219.3 34.1642 218.372 34.3396 217.285 34.3396ZM231.514 28.3962V25.7753L239.273 16.169V16.0554H231.782V12.5472H244.567V15.4054L237.282 24.7745V24.888H244.835V28.3962H231.514Z"
                  fill="white"
                />
                <path
                  d="M192.17 28.3962C193.629 28.3962 194.811 27.2136 194.811 25.7547C194.811 24.2959 193.629 23.1132 192.17 23.1132C190.711 23.1132 189.528 24.2959 189.528 25.7547C189.528 27.2136 190.711 28.3962 192.17 28.3962Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 500,
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
