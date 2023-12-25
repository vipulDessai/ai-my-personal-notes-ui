const path = require("path");

module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      width: 200,
      code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
    };
  },
};
