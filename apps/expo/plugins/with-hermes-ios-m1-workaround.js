const { withDangerousMod } = require("@expo/config-plugins");
const path = require("path");
const fs = require("fs");

function withNewPodfile(config) {
  return withDangerousMod(config, [
    "ios",
    async (c) => {
      const filePath = path.join(c.modRequest.platformProjectRoot, "Podfile");
      const contents = fs.readFileSync(filePath, "utf-8");

      const results = contents.includes(
        "# Workaround simulator build error for hermes with react-native 0.64 on mac m1 devices"
      )
        ? contents
        : contents.replace(
            "react_native_post_install(installer)",
            `react_native_post_install(installer)

    # Workaround simulator build error for hermes with react-native 0.64 on mac m1 devices
    arm_value = \`/usr/sbin/sysctl -n hw.optional.arm64 2>&1\`.to_i
    has_hermes = has_pod(installer, 'hermes-engine')
    if arm_value == 1 && has_hermes
        projects = installer.aggregate_targets
        .map{ |t| t.user_project }
        .uniq{ |p| p.path }
        .push(installer.pods_project)
        projects.each do |project|
        project.build_configurations.each do |config|
            config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] + ' arm64'
        end
        project.save()
        end
    end`
          );
      fs.writeFileSync(filePath, results);

      return c;
    },
  ]);
}

module.exports = (config) => {
  return withNewPodfile(config);
};
