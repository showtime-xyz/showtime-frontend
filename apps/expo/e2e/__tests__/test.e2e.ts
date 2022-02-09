import { by, device, element, expect } from "detox";

describe("Showtime", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should run", async () => {});
});
