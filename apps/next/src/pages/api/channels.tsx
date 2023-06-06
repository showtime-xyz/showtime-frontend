import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

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

export default async function handler(req: NextRequest) {
  const { search } = req.nextUrl;

  const paramsString = decodeURIComponent(search).replace(/&amp;/g, "&");
  const searchParams = new URLSearchParams(paramsString);
  const username = searchParams.get("username");
  const image = searchParams.get("image");

  const fontBoldData = await fontBold;
  const fontSemiBoldData = await fontSemiBold;

  return new ImageResponse(
    (
      <div
        style={{
          color: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          letterSpacing: -2,
          fontFamily: "Inter",
        }}
      >
        <img
          width={800}
          height={400}
          src={`${baseURL}/assets/ChannelPromoteBg.png`}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
          }}
        />
        <div
          style={{
            color: "black",
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            display: "flex",
            letterSpacing: -2,
          }}
        >
          <div
            style={{
              width: 400,
              height: 400,
              display: "flex",
              marginLeft: "-90px",
              marginTop: "-24px",
            }}
          >
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M200 400C310.457 400 400 310.457 400 200C400 176.826 396.059 154.572 388.809 133.873C382.8 136.084 376.306 137.292 369.529 137.292C338.702 137.292 313.711 112.301 313.711 81.4739C313.711 67.7302 318.678 55.1467 326.915 45.4205C292.388 17.0391 248.184 0 200 0C89.5431 0 0 89.5431 0 200C0 310.457 89.5431 400 200 400Z"
                fill="#D9D9D9"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M200 400C310.457 400 400 310.457 400 200C400 176.826 396.059 154.572 388.809 133.873C382.8 136.084 376.306 137.292 369.529 137.292C338.702 137.292 313.711 112.301 313.711 81.4739C313.711 67.7302 318.678 55.1467 326.915 45.4205C292.388 17.0391 248.184 0 200 0C89.5431 0 0 89.5431 0 200C0 310.457 89.5431 400 200 400Z"
                fill="url(#pattern0)"
              />
              <path
                d="M371.093 106.978C371.749 108.069 373.165 108.422 374.256 107.766C375.347 107.111 375.7 105.694 375.044 104.603L371.093 106.978ZM363.805 94.855L371.093 106.978L375.044 104.603L367.756 92.4799L363.805 94.855Z"
                fill="black"
              />
              <path
                d="M386.504 64.5714C390.119 64.5714 393.05 67.5024 393.05 71.1179C393.05 72.0195 392.868 72.8785 392.539 73.6601"
                stroke="black"
                strokeWidth="4.60986"
                strokeLinecap="round"
              />
              <path
                d="M362.93 74.283L350.163 82.2068C349.862 82.3934 349.658 82.7083 349.606 83.0583C348.751 88.8095 351.772 94.533 357.047 96.9773C357.404 97.1424 357.818 97.1214 358.156 96.9211L371.303 89.1269C375.348 86.7286 380.144 85.9287 384.749 86.884C387.04 87.3594 388.806 84.8881 387.613 82.8746L375.597 62.5765C374.426 60.5985 371.444 61.0433 370.902 63.2769C369.791 67.8491 366.928 71.8018 362.93 74.283Z"
                fill="black"
                stroke="black"
                strokeWidth="4.60986"
                strokeLinejoin="round"
              />
              <defs>
                <pattern
                  id="pattern0"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0_1434_1101"
                    transform="translate(0 -0.250567) scale(0.00226757)"
                  />
                </pattern>
                <image
                  id="image0_1434_1101"
                  width="441"
                  height="662"
                  href={image}
                />
              </defs>
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginLeft: "-50px",
              paddingBottom: 160,
            }}
          >
            <b
              style={{
                fontSize: 35,
                lineHeight: 1.5,
                fontWeight: 600,
                fontFamily: "Inter-SemiBold",
                letterSpacing: 0.5,
              }}
            >
              Join Channel
            </b>

            <div
              style={{
                maxWidth: 420,
                display: "flex",
                flexWrap: "wrap",
                fontSize: 40,
                fontWeight: 700,
                lineHeight: 1.4,
                letterSpacing: 0.3,
                justifyContent: "center",
                width: "auto",
                textAlign: "center",
                wordBreak: "break-word",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              @{username}
            </div>
            <img
              src={`${baseURL}/assets/ChannelPromoteDownload.png`}
              alt=""
              width={315}
              height={120}
              style={{
                position: "absolute",
                bottom: 40,
              }}
            />
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
