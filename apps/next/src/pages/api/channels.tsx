import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");
  const image = searchParams.get("image");
  const baseURL = __DEV__
    ? "http://localhost:3000"
    : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`;

  return new ImageResponse(
    (
      <div
        style={{
          color: "black",
          width: "100%",
          height: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          display: "flex",
          backgroundImage: `url(${baseURL}/assets/ChannelPromoteBg.png)`,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          fontSize: 60,
          letterSpacing: -2,
        }}
      >
        <div
          style={{
            width: 400,
            height: 400,
            display: "flex",
            marginLeft: "-100px",
            marginTop: "-16px",
          }}
        >
          <img
            alt="avatar"
            src={image}
            style={{
              borderRadius: 999,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginLeft: "-50px",
            width: "100%",
            fontSize: 40,
            fontWeight: 900,
          }}
        >
          <p
            style={{
              lineHeight: "35px",
              margin: 0,
              display: "flex",
            }}
          >
            Join Channel
          </p>
          <p
            style={{
              marginTop: 20,
              marginBottom: 60,
              display: "flex",
            }}
          >
            @{username}
          </p>
          <img
            src={`${baseURL}/assets/ChannelPromoteDownload.png`}
            alt=""
            width={315}
            height={120}
            style={{}}
          />
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
}
