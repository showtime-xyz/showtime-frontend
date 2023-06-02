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
          display: "flex",
          fontSize: 60,
          letterSpacing: -2,
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
            fontWeight: 700,
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
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 999,
                display: "flex",
                position: "absolute",
                right: 16,
                top: 24,
              }}
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.2724 5.9111C10.1584 6.20282 9.94854 6.44706 9.67724 6.60367L1.97021 11.0533C1.43142 11.3644 1.03825 11.8767 0.87719 12.4776C0.716129 13.0785 0.800374 13.7187 1.11139 14.2573L3.45676 18.3197C3.76779 18.8583 4.2801 19.2514 4.881 19.4124C5.4819 19.5734 6.12218 19.4891 6.66097 19.1779C7.22195 18.854 7.93929 19.0462 8.26317 19.6072L10.0221 22.6538C10.1776 22.9232 10.4338 23.1197 10.7342 23.2002C11.0347 23.2807 11.3548 23.2384 11.6242 23.0829L13.6557 21.9101C13.9251 21.7545 14.1217 21.4983 14.2022 21.1979C14.2828 20.8974 14.2406 20.5774 14.0851 20.308L12.4295 17.4404C12.0486 16.7806 12.2747 15.9369 12.9344 15.556L14.368 14.7283C14.6392 14.5717 14.9557 14.5121 15.2653 14.5592L19.374 15.1845C20.5175 15.3586 21.3545 14.1327 20.7763 13.131L14.2646 1.85262C13.6863 0.850916 12.2061 0.962926 11.785 2.04025L10.2724 5.9111ZM16.3145 10.0947C16.8325 10.9919 16.0827 12.0899 15.0585 11.934C14.7812 11.8918 14.4978 11.9452 14.2548 12.0854L6.68296 16.4571C6.02316 16.838 5.17947 16.612 4.79852 15.9521L3.83265 14.2791C3.45172 13.6194 3.67778 12.7757 4.33759 12.3947L11.9094 8.02314C12.1523 7.88287 12.3403 7.66411 12.4424 7.40282C12.8196 6.43789 14.1454 6.33756 14.6633 7.23476L16.3145 10.0947ZM22.0913 4.85281C22.7185 5.93908 22.9275 7.18204 22.7193 8.36561C22.5434 9.36628 21.3087 9.36175 20.8007 8.48186L18.3127 4.1726C17.8024 3.28864 18.4229 2.21514 19.3804 2.56873C20.5034 2.98344 21.4711 3.7785 22.0913 4.85281Z"
                  fill="black"
                />
                <path
                  d="M20.1886 13.8274L13.0833 3.88L12.136 7.19578L3.13597 11.4589L2.1886 13.8274L5.97807 18.5642L14.9781 13.8274H20.1886Z"
                  fill="black"
                />
              </svg>
            </div>
          </div>
          <div
            style={{
              display: "block",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginLeft: "-50px",
              width: "100%",
            }}
          >
            <b>Join Channel</b>
            <b> @{username}</b>
            <img
              src={`${baseURL}/assets/ChannelPromoteDownload.png`}
              alt=""
              width={315}
              height={120}
              style={{}}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
}
