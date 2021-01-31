export default async ({ query: { address } }, res) => {
  let data_profile = { data: [] };

  try {
    const res_profile = await fetch(
      `${process.env.BACKEND_URL}/v2/profile?address=${address}`,
      {
        headers: {
          "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY,
        },
      }
    );
    data_profile = await res_profile.json();
  } catch {}

  res.statusCode = 200;
  res.json(data_owned);
};
