const permission = {
  _id: false,
  action: { type: String },                    // action
  subject: { type: String },                   // resource subject (resource:id)
  inverted: { type: Boolean, default: false }, // cannot
  begin: { type: Date },                       // start of time frame
  end: { type: Date },                         // end of time frame
  creator: { type: 'ObjectId' },               // granted by
  conditions: { type: 'Mixed' },               // conditions
};

/*
 * role is a group of permissions.
 * "roles" are assigned to a group to grant the permission.
 */
const role = {
  _id: false,
  role: { type: String, required: true },      // name of role
  description: { type: String },               // description of role
  permissions: [permission],                   // group of permissions
};

export default { permission, role };