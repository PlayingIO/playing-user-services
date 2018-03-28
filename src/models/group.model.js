import mongoose from 'mongoose';
import { plugins } from 'mostly-feathers-mongoose';
import { models as contents } from 'playing-content-services';

const options = {
  timestamps: true
};

/**
 * A "group" is a collection of users.
 */
const fields = {
  groupname: { type: String, required: true, unique: true },
  parent: { type: 'ObjectId' },              // parent group
  label: { type: String, required: true },   // display label
  description: { type: String },             // brief description of the group
  image: contents.blob.schema,               // image which represents the group
  roles: [{ type: String }],                 // defines the roles
  owner: { type: 'ObjectId' },               // owner who created the group
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}

model.schema = fields;