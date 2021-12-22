import handler, { middleware } from "@/lib/api-handler";

export default handler()
  .use(middleware.auth)
  .get(async ({ user }, res) => res.json(user));
