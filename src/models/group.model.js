import mongoose from 'mongoose';
import { plugins } from 'mostly-feathers-mongoose';
import { schemas as contents } from 'playing-content-common';

const options = {
  timestamps: true,
  discriminatorKey: 'type',
};

/**
 * A "group" is a collection of users.
 */
const fields = {
  groupname: { type: String, required: true, unique: true },
  type: { type: String, default: 'group' },  // discriminator key
  parent: { type: 'ObjectId' },              // parent group
  label: { type: String, required: true },   // display label
  description: { type: String },             // brief description of the group
  image: contents.blob.schema,               // image which represents the group
  roles: [{ type: String }],                 // defines the roles
  owner: { type: String },                   // owner who created the group
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.plugin(plugins.trashable);
  schema.index({ type: 1 });
  return mongoose.model(name, schema);
}

model.schema = fields;