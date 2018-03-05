import glob from 'glob';
import path from 'path';
import { permission, role } from './permission-schema';

// load all models
let modelFiles = glob.sync(path.join(__dirname, './*-model.js'));
modelFiles.forEach(file => {
  let name = path.basename(file, '-model.js');
  module.exports[name] = require(file);
});

module.exports.permission = permission;
module.exports.role = role;
