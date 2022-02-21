import { render } from "@testing-library/react-native";
import axios from "axios";
import preloadAll from "jest-next-dynamic";

import App from "../App";

describe("mounts app", () => {
  const { getByTestId, debug } = render(<App />);
  beforeAll(async () => {
    await preloadAll();
  });

  test("mounts feed and calls feed api", async () => {
    const homeText = getByTestId("homeFeed");
    expect(homeText).toBeDefined();
    expect(axios).toBeCalledWith({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      data: undefined,
      method: "GET",
      signal: undefined,
      url: "/v2/activity_without_auth?page=1&type_id=0&limit=5",
    });
  });
});
