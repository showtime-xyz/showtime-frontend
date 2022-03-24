const {
  createRunOncePlugin,
  withGradleProperties,
} = require("@expo/config-plugins");

const withAnimatedWebPSupport = (config) => {
  const propertyToModify = {
    type: "property",
    key: "expo.webp.animated",
    value: true,
  };

  return withGradleProperties(config, (config) => {
    config.modResults = config.modResults.filter(
      (item) =>
        !(
          item.type === propertyToModify.type &&
          item.key === propertyToModify.key
        )
    );

    config.modResults.push(propertyToModify);

    return config;
  });
};

module.exports = createRunOncePlugin(
  withAnimatedWebPSupport,
  "animated-webp-support",
  "1.0.0"
);
