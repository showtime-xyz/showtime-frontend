export default async ({ query: { address } }, res) => {
  let data_owned = { data: [] };

  try {
    const res_owned = await fetch(
      `${process.env.BACKEND_URL}/v1/owned?address=${address}&maxItemCount=9`
    );
    data_owned = await res_owned.json();
  } catch {}

  res.statusCode = 200;
  res.json(data_owned);
};
