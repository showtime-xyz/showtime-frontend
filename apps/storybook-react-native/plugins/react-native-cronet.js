const {
  withDangerousMod,
  WarningAggregator,
  AndroidConfig,
  withAppBuildGradle,
} = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

async function readFileAsync(path) {
  return fs.promises.readFile(path, "utf8");
}

async function saveFileAsync(path, content) {
  return fs.promises.writeFile(path, content, "utf8");
}

async function editMainApplication(config, action) {
  const mainApplicationPath = AndroidConfig.Paths.getProjectFilePath(
    config.modRequest.projectRoot,
    "MainApplication"
  );

  try {
    const mainApplication = action(await readFileAsync(mainApplicationPath));
    return await saveFileAsync(mainApplicationPath, mainApplication);
  } catch (e) {
    WarningAggregator.addWarningAndroid(
      "react-native-cronet",
      `Couldn't modify MainApplication.java - ${e}.`
    );
  }
}

const withMainApplication = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      await editMainApplication(config, (mainApplication) => {
        if (
          mainApplication.includes(
            "import com.akshetpandey.rncronet.RNCronetFrescoImagePipelineConfig;"
          )
        ) {
          return mainApplication;
        }

        mainApplication = mainApplication.replace(
          `import com.facebook.react.ReactApplication;`,
          `import com.facebook.react.ReactApplication;
import com.akshetpandey.rncronet.RNCronetFrescoImagePipelineConfig;
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.react.shell.MainPackageConfig;`
        );

        mainApplication = mainApplication.replace(
          `List<ReactPackage> packages = new PackageList(this).getPackages();`,
          `ImagePipelineConfig pipelineConfig = RNCronetFrescoImagePipelineConfig.build(getApplicationContext());
      MainPackageConfig config = new MainPackageConfig.Builder().setFrescoConfig(pipelineConfig).build();
      List<ReactPackage> packages = new PackageList(this, config).getPackages();`
        );

        return mainApplication;
      });

      return config;
    },
  ]);
};

module.exports = function withCronet(config) {
  config = withMainApplication(config);
  return config;
};
