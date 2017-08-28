import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { plugins } from 'mostly-feathers-mongoose';

/*
 * A "group" is a collection of users.
 * "roles" are assigned to a group to grant the permissions.
 */
const fields = {
  groupname: { type: 'String', required: true, unique: true },
  parent: { type: 'ObjectId' }, // parent group
  label: { type: 'String', required: true },
  description: { type: 'String' },
  roles: [{ type: 'ObjectId' }]
};

export default function(app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields);
  schema.plugin(timestamps);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}