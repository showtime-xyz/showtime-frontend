import { by, device, element, expect } from "detox";

describe("Showtime", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should show home screen", async () => {
    await expect(element(by.text("Home"))).toBeVisible();
  });
});
