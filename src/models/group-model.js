import mongoose from 'mongoose';
import { plugins } from 'mostly-feathers-mongoose';
import { models as contents } from 'playing-content-services';

const options = {
  timestamps: true
};

const role = {
  _id: false,
  role: { type: String },                   // name of the role
  permits: { type: 'Mixed' },               // map of all permissions
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
  roles: [role]                              // defines the roles/permissions
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}

model.schema = fields;