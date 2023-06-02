import axios from "axios";

export { default } from "app/pages/creator-channels";

export async function getServerSideProps(context) {
  const { channelId } = context.params;
  const username = "alan";
  const imageUrl =
    "https://lh3.googleusercontent.com/G3156TjbanMrCJpQwJL-MgesnfwUDR4Njh2W1awyZUfTlXvW9QcIblzP0v5L3zY6z7TkzhiP0UH1i87Iq7b5e0FnlK3AIQKO81KxIQ";

  try {
    // const res = await axios.get(
    //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channels/${channelId}`
    // );
    const image = `${
      __DEV__
        ? "http://localhost:3000"
        : `https://${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`
    }/api/channels?username=${username}&image=${imageUrl}`;
    console.log(image);

    return {
      props: {
        meta: {
          title: `Showtime`,
          description: "",
          image,
        },
      },
    };
  } catch (error) {}
  return {
    props: {},
  };
}
