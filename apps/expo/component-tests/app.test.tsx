import { render } from "@testing-library/react-native";
import axios from "axios";
import preloadAll from "jest-next-dynamic";

import { setAccessToken } from "app/lib/access-token";
import { setRefreshToken } from "app/lib/refresh-token";

import App from "../App";

describe("app mount - unauthenticated user", () => {
  const { getByTestId } = render(<App />);
  beforeAll(async () => {
    await preloadAll();
  });

  test("mounts feed", async () => {
    const homeText = getByTestId("homeFeed");
    expect(homeText).toBeDefined();
  });

  test("calls unauthenticated feed api", async () => {
    expect(axios).toBeCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "/v3/feed/curated?offset=1&limit=5",
      })
    );
  });
});

describe("app mount - authenticated user", () => {
  const token = "123";
  setAccessToken(token);
  setRefreshToken("345");

  render(<App />);
  beforeAll(async () => {
    await preloadAll();
  });

  test("calls myinfo api", async () => {
    expect(axios).toBeCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "/v2/myinfo",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
    );
  });

  test("calls authenticated feed api", async () => {
    expect(axios).toBeCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "/v3/feed?offset=1&limit=5",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
    );
  });
});
