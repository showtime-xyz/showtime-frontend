import { render } from "@testing-library/react-native";
import preloadAll from "jest-next-dynamic";

import App from "../App";

describe("mounts app", () => {
  const { getByTestId, debug } = render(<App />);
  beforeAll(async () => {
    await preloadAll();
  });

  test("mounts feed", async () => {
    const homeText = getByTestId("homeFeed");
    expect(homeText).toBeDefined();
  });
});
