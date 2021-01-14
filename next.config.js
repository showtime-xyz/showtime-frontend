const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* development only config options here */
      env: {
        BACKEND_URL: "http://localhost:8001/api",
      },
    };
  }

  return {
    /* config options for all phases except development here */
    env: {
      BACKEND_URL: "https://showtimenft.wl.r.appspot.com/api",
    },
  };
};
