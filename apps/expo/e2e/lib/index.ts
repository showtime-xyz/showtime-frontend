import { device } from "detox";
import * as fs from "fs";
import * as path from "path";

import { setStatusBar } from "./set-status-bar";

export function getOutputDir(projectRoot: string, locale: string) {
  return path.resolve(
    projectRoot,
    `meta/screenshots/${device.getPlatform()}/${locale}/`
  );
}

export async function takeScreenshotAsync({
  info,
  projectRoot,
  index,
  locale,
}: {
  projectRoot: string;
  locale: string;
  info?: string;
  index?: number;
}) {
  const outputDir = getOutputDir(projectRoot, locale);
  fs.mkdirSync(outputDir, { recursive: true });

  if (index === null) {
    index = fs.readdirSync(outputDir).length;
  }

  const name = `APP_${device.name}_${index ?? ""}`.toUpperCase();
  const imgPath = path.resolve(outputDir, `${name}.png`);
  const imagePath = await device.takeScreenshot(name);
  await fs.promises.copyFile(imagePath, imgPath);
}

export function createCapture({
  projectRoot,
  locale,
}: {
  locale: string;
  projectRoot: string;
}) {
  const captureAsync = () =>
    takeScreenshotAsync({
      projectRoot,
      locale,
    });

  const clearAsync = async () => {
    // Clear old screen shots
    const outputDir = getOutputDir(projectRoot, locale);
    await fs.promises.rm(outputDir, { recursive: true }).catch(() => null);
  };

  return {
    captureAsync,
    clearAsync,
    async resetAppAsync() {
      // Clear old screen shots
      await clearAsync();
      // configure status bars

      void setStatusBar();

      // reset expo-localization which doesn't account for simulators dynamically updating without resetting the phone.
      await device.terminateApp();

      // launch with lang
      await device.launchApp({
        languageAndLocale: { locale, language: locale },
        launchArgs: { locale },
      });
    },
  };
}
