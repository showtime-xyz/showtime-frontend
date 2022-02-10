import preloadAll from "jest-next-dynamic";
import { render } from "@testing-library/react-native";
import App from "../App";

describe("mounts app", () => {
  const { getByTestId, debug } = render(<App />);
  beforeAll(async () => {
    await preloadAll();
  });

  test("mounts feed", async () => {
    debug();
    const homeText = getByTestId("homeFeed");
    expect(homeText).toBeDefined();
  });
});
