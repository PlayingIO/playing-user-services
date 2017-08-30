import timestamps from 'mongoose-timestamp';
import { plugins } from 'mostly-feathers-mongoose';

/*
 * A "role" is a collection of permissions.
 * "roles" are assigned to either a group or a user to grant the permission.
 */
const fields = {
  rolename: { type: 'String', required: true, unique: true },
  label: { type: 'String', required: true },
  description: { type: 'String' },
  acls: [{ type: 'String' }],
};

export default function(app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields);
  schema.plugin(timestamps);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}