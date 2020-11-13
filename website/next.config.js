const path = require("path");

const SWISS_MAPS_DIR = path.dirname(require.resolve("swiss-maps/package.json"));

console.log("Build env", { SWISS_MAPS_DIR });

module.exports = {
  env: {
    SWISS_MAPS_DIR,
  },
};
