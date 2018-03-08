import { plugins } from 'mostly-feathers-mongoose';
import { permission } from './permission-schema';

const options = {
  timestamps: true
};

/*
 * user's permissions list of subjects
 */
const fields = {
  subject: { type: 'String', required: true },    // subject id with type (service, document, group, etc)
  user: { type: 'ObjectId', required: true },     // user/group id
  permission: permission                          // permission
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.index({ document: 1, user: 1 });
  return mongoose.model(name, schema);
}

model.schema = fields;