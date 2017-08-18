import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { plugins } from 'mostly-feathers-mongoose';

const fields = {
  name: { type: 'String', required: true, unique: true },
  label: { type: 'String', required: true },
  description: { type: 'String' },
};

export default function(app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields);
  schema.plugin(timestamps);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}