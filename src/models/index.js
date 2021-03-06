const { camelCase } = require('mostly-func');
const glob = require('glob');
const path = require('path');

// load all models
const modelFiles = glob.sync(path.join(__dirname, './*.model.js'));
module.exports = Object.assign({}, ...modelFiles.map(file => {
  const name = camelCase(path.basename(file, '.model.js'));
  return { [name]: require(file) };
}));
