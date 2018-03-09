import { plugins } from 'mostly-feathers-mongoose';

const options = {
  timestamps: true
};

/*
 * user's permissions list of subjects
 */
const fields = {
  actions: [{ type: String, required: true }],  // actions
  alias: [{ type: String }],                    // alias of action
  subject: { type: 'String', required: true },  // subject with optional id (service, document, group, etc)
  user: { type: 'String', required: true },     // user/group/thirdparty id
  role: { type: 'String' },                     // role of group
  inverted: { type: Boolean, default: false },  // cannot
  creator: { type: 'ObjectId' },                // granted by
  begin: { type: Date },                        // start of time frame
  end: { type: Date },                          // end of time frame
  conditions: { type: 'Mixed' },                // conditions
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.index({ actions: 1, subject: 1, user: 1, role: 1 }, { unique: true });
  return mongoose.model(name, schema);
}

model.schema = fields;