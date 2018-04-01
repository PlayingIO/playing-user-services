require = require("esm")(module/*, options*/);
console.time('playing-user-services import');
module.exports = require('./src/index').default;
module.exports.entities = require('./src/entities').default;
module.exports.models = require('./src/models').default;
console.timeEnd('playing-user-services import');
