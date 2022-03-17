import handler from "@/lib/api-handler";
import backend from "@/lib/backend";

export default handler().post(
  async (
    {
      body: {
        profileId = 51,
        page = 1,
        limit = 6,
        listId = 1,
        sortId = 1,
        showHidden = 0,
        showDuplicates = 0,
        collectionId = 0,
      },
      user,
    },
    res
  ) => {
    await backend
      .get(
        `/v1/profile_nfts?profile_id=${profileId}&page=${page}&limit=${limit}&list_id=${listId}&sort_id=${sortId}&show_hidden=${showHidden}&show_duplicates=${showDuplicates}&collection_id=${collectionId}`,
        {
          headers: {
            "X-Authenticated-User": user?.publicAddress || null,
            "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY_V2,
          },
        }
      )
      .then((resp) => res.json(resp.data));
  }
);
