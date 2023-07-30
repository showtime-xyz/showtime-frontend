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
              Collect on
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
