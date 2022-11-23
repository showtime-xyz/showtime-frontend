const raf = require("raf");

const polys = {};
raf.polyfill(polys);

module.exports = polys.requestAnimationFrame;
