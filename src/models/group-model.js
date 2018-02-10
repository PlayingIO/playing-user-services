import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { plugins } from 'mostly-feathers-mongoose';
import { models as contents } from 'playing-content-services';

const role = {
  role: { type: String, required: true },   // name of the role
  permissions: { type: 'Mixed' },           // map of all permissions
};

/*
 * A "group" is a collection of users.
 * "roles" are assigned to a group to grant the permissions.
 */
const fields = {
  groupname: { type: String, required: true, unique: true },
  parent: { type: 'ObjectId' },              // parent group
  label: { type: String, required: true },   // display label
  description: { type: String },             // brief description of the group
  image: contents.blob.schema,               // image which represents the group
  roles: [role],                             // defines the roles present in each team
  creatorRoles: [{ type: String }]
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields);
  schema.plugin(timestamps);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}

model.schema = fields;