import { plugins } from 'mostly-feathers-mongoose';

const options = {
  timestamps: true
};

/*
 * A "role" is a collection of permissions.
 * "roles" are assigned to either a group or a user to grant the permission.
 */
const fields = {
  rolename: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  description: { type: String },
  acls: [{ type: String }],
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}

model.schema = fields;